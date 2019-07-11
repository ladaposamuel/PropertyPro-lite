import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import { Property, propertyService } from '../models/Property';
import userData from './data/userData';
import propertyData from './data/propertyData';
import db from '../database';

import userHelper from '../helpers/userHelper';

const path = require('path');

let token;
chai.use(chaiHttp);
const { expect } = chai;

before((done) => {
  db.query('DROP TABLE IF EXISTS property CASCADE', () => done());
});
before((done) => {
  db.query(
    `CREATE TABLE property (
      id serial PRIMARY KEY,
      agent_id Integer NOT NULL,
      status TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT NOT NULL,
      price Float NOT NULL,
      address TEXT NOT NULL,
      type TEXT NOT NULL,
      image_url  TEXT NOT NULL,
      created_on TIMESTAMP NOT NULL,
      updated_on TIMESTAMP NOT NULL
)`,
    () => done(),
  );
});
describe('Agents', () => {
  const { user } = userData;
  const { property } = propertyData;
  before(() => {
    token = userHelper.generateToken(user.demoUser);
  });

  it('should be able to post properties', async () => {
    const res = await chai
      .request(server)
      .post('/api/v1/property')
      .set('x-access-token', token)
      .field('Content-Type', 'multipart/form-data')
      .field(property)
      .type('form')
      .attach('image', path.join(__dirname, '../test/data/test.png'), 'test.png');
    expect(res.status).to.eql(201);
    expect(res.body.status).to.eql('success');
    expect(res.body.data).to.have.property('agent_id');
    expect(res.body.data).to.have.property('price');
    expect(res.body.data)
      .to.have.property('state')
      .to.be.a('string');
    expect(res.body.data)
      .to.have.property('city')
      .to.be.a('string');
    expect(res.body.data)
      .to.have.property('address')
      .to.be.a('string');
    expect(res.body.data).to.have.property('image_url');
  }).timeout(20000);
  it('should be see an error if property price not stated', (done) => {
    chai
      .request(server)
      .post('/api/v1/property')
      .type('form')
      .set('x-access-token', token)
      .send({
        state: property.state,
        city: property.city,
        address: property.address,
        type: property.type,
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('A valid price/amount is required');
        done();
      });
  });
  it('should be see an error if property state not stated', (done) => {
    chai
      .request(server)
      .post('/api/v1/property')
      .type('form')
      .set('x-access-token', token)
      .send({
        price: property.price,
        address: property.address,
        city: property.city,
        type: property.type,
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('Please enter the state where property is located');
        done();
      });
  });
  it('should be see an error if property address not stated', (done) => {
    chai
      .request(server)
      .post('/api/v1/property')
      .type('form')
      .set('x-access-token', token)
      .send({
        price: property.price,
        state: property.state,
        city: property.city,
        type: property.type,
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('Please enter the address where property is located');
        done();
      });
  });
  it('should be see an error if no image uploaded', (done) => {
    chai
      .request(server)
      .post('/api/v1/property')
      .type('form')
      .set('x-access-token', token)
      .send(property)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('You need to attach an Image to your property');
        done();
      });
  });
  it('should be able to mark a property as sold', (done) => {
    chai
      .request(server)
      .patch('/api/v1/property/1/sold')
      .type('form')
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.be.an('object');
        done();
      });
  });
  it('should see an error if marking a wrong property as sold', (done) => {
    chai
      .request(server)
      .patch('/api/v1/property/12/sold')
      .type('form')
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.status).to.eql('error');
        done();
      });
  });
});

describe('Users', () => {
  it('should be able to view a property', (done) => {
    chai
      .request(server)
      .get('/api/v1/property/1')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        done();
      });
  });
  it('should be able to view a specific property', (done) => {
    chai
      .request(server)
      .get('/api/v1/property/?type=Flat')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });
  it('should see an error if a specific property is not found', (done) => {
    chai
      .request(server)
      .get('/api/v1/property/29')
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        done();
      });
  });
  it('should be able to view all properties', (done) => {
    chai
      .request(server)
      .get('/api/v1/property')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        done();
      });
  });
  it('should be able to flag properties', (done) => {
    const dummyProperty = new Property({
      id: 200,
      owner: 1,
      price: 10009,
      state: 'Oyo',
      city: 'Ibadan',
      address: 'Abule EHba',
      type: 'Flat',
      created_on: 'Sun Jun 23 2019',
      image_url:
        'http://res.cloudinary.com/sidehustle/image/upload/v1561272329/hqdbfkokynnxpy2te26a.png',
    });
    propertyService.createProperty(dummyProperty);
    const flag = {
      reason: 'price',
      description: 'Price is way too much',
    };
    chai
      .request(server)
      .post('/api/v1/property/flag/200')
      .send(flag)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        done();
      });
  });
  it('should see an error if trying to flag unavailable property', (done) => {
    const flag = {
      property_id: 0,
      reason: 'price',
      description: 'Price is way too much',
    };
    chai
      .request(server)
      .post('/api/v1/property/flag/99')
      .send(flag)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('No Property found with such ID');
        done();
      });
  });
  it('should see an error if trying to flag with no reason', (done) => {
    const flag = {
      description: 'Price is way too much',
    };
    chai
      .request(server)
      .post('/api/v1/property/flag/99')
      .send(flag)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('Please provide a flag reason');
        done();
      });
  });
  it('should see an error if trying to flag with no description', (done) => {
    const flag = {
      reason: 'price',
    };
    chai
      .request(server)
      .post('/api/v1/property/flag/9')
      .send(flag)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('Please provide a flag description');
        done();
      });
  });
});
