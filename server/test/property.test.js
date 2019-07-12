import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import userData from './data/userData';
import propertyData from './data/propertyData';
import db from '../database';

import userHelper from '../helpers/userHelper';

const path = require('path');

let token;
let Usertoken;
chai.use(chaiHttp);
const { expect } = chai;

before(async () => {
  await db.query('DROP TABLE IF EXISTS property CASCADE');
  await db.query('DROP TABLE IF EXISTS flag CASCADE');
});
before(async () => {
  const { user } = userData;

  await db.query(
    `CREATE TABLE property (
      id serial PRIMARY KEY,
      owner Integer NOT NULL,
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
  );
  await db.query(
    `CREATE TABLE flag (
      id serial PRIMARY KEY,
      property_id Integer NOT NULL,
      reason TEXT NOT NULL,
      description TEXT NOT NULL,
      reporter Integer NOT NULL,
      created_on TIMESTAMP NOT NULL
)`,
  );
  const creatQuery = `INSERT INTO 
            property (owner, price , status, state, city, address, type, image_url, created_on,updated_on) 
            VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8, $9, $10) RETURNING *`;
  const values = [
    1,
    300000,
    'available',
    'Lagos',
    'Lagos',
    '12 world street',
    'Flat',
    'http://image.url/file.jpg',
    new Date().toDateString(),
    new Date().toDateString(),
  ];

  const createUserQuery = `INSERT INTO
  users (first_name , last_name, email, phone_number, address, password, is_admin, created_date, modified_date)
  VALUES ($1, $2, $3, $4, $5, $6 ,$7, $8 , $9)
  returning *`;
  const userValues = [
    user.demoUser3.first_name,
    user.demoUser3.last_name,
    user.demoUser3.email,
    user.demoUser3.phone_number,
    user.demoUser3.address,
    user.demoUser3.password,
    user.demoUser3.is_admin,
    new Date().toDateString(),
    new Date().toDateString(),
  ];
  await db.query(createUserQuery, userValues);
  await db.query(creatQuery, values);
});
describe('Agents', () => {
  const { user } = userData;
  const { property } = propertyData;
  before(() => {
    token = userHelper.generateToken(user.demoUser);
    Usertoken = userHelper.generateToken(user.demoUser3);
  });

  it('should be logged in to access routes', (done) => {
    chai
      .request(server)
      .post('/api/v1/property/')
      .set('x-access-token', '')
      .send({})
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('Access denied. No token provided.');
        done();
      });
  });
  it('should be allowed to access protected routes', (done) => {
    chai
      .request(server)
      .post('/api/v1/property/')
      .set('x-access-token', Usertoken)
      .send({})
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('Access denied. Only Agents can access this route');
        done();
      });
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
    expect(res.body.data).to.have.property('owner');
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
  it('should be able update property details', (done) => {
    chai
      .request(server)
      .patch('/api/v1/property/1')
      .type('form')
      .set('x-access-token', token)
      .send({
        price: property.price,
      })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.be.an('object');
        done();
      });
  });
  it('should be able to update property image', async () => {
    const res = await chai
      .request(server)
      .patch('/api/v1/property/1')
      .set('x-access-token', token)
      .field('Content-Type', 'multipart/form-data')
      .type('form')
      .attach('image', path.join(__dirname, '../test/data/test.png'), 'test.png');
    expect(res.status).to.eql(200);
    expect(res.body.status).to.eql('success');
    expect(res.body.data).to.have.property('owner');
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
  it('should be provide valid price details', (done) => {
    chai
      .request(server)
      .patch('/api/v1/property/1')
      .type('form')
      .set('x-access-token', token)
      .send({
        price: 'wrong',
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('A valid price/amount is required');
        done();
      });
  });
  it('should be able to delete a property', (done) => {
    chai
      .request(server)
      .delete('/api/v1/property/1')
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data.message).to.eql('Property Deleted successfully');
        done();
      });
  });
  it('should be not be able to delete an unavailable property', (done) => {
    chai
      .request(server)
      .delete('/api/v1/property/12')
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
  const { user } = userData;
  before(() => {
    Usertoken = userHelper.generateToken(user.demoUser3);
  });
  it('should be able to view a property', (done) => {
    chai
      .request(server)
      .get('/api/v1/property/2')
      .set('x-access-token', Usertoken)
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
      .set('x-access-token', Usertoken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });
  it('should return 404 if specific property is not found', (done) => {
    chai
      .request(server)
      .get('/api/v1/property/29')
      .set('x-access-token', Usertoken)
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
      .set('x-access-token', Usertoken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        done();
      });
  });
  it('should be logged in to flag a property', (done) => {
    chai
      .request(server)
      .post('/api/v1/property/2/flag')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.error).to.eql('Access denied. No token provided.');
        done();
      });
  });

  it('should be able to flag properties', (done) => {
    const flag = {
      reason: 'price',
      description: 'Price is way too much',
    };
    chai
      .request(server)
      .post('/api/v1/property/2/flag')
      .set('x-access-token', Usertoken)
      .send(flag)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data.reason).to.eql('price');
        expect(res.body.data.description).to.eql('Price is way too much');
        done();
      });
  });
  it('should see an error if trying to flag unavailable property', (done) => {
    const flag = {
      reason: 'price',
      description: 'Price is way too much',
    };
    chai
      .request(server)
      .post('/api/v1/property/99/flag')
      .set('x-access-token', Usertoken)
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
      .post('/api/v1/property/2/flag')
      .set('x-access-token', Usertoken)
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
      .post('/api/v1/property/2/flag')
      .set('x-access-token', Usertoken)
      .send(flag)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('Please provide a flag description');
        done();
      });
  });
});
