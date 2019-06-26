import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import { User, userService } from '../models/User';
import { Property, propertyService } from '../models/Property';
import userHelper from '../helpers/userHelper';
import dummyData from '../utils/dummy';

chai.use(chaiHttp);
const { expect } = chai;

describe('Users', () => {
  it('should be able to view a property', (done) => {
    const dummyProperty = new Property({
      id: 1,
      owner: 1,
      price: 10009,
      state: 'Oyo',
      city: 'Ibadan',
      address: 'Abule EHba',
      type: '2 Bedroom',
      created_on: 'Sun Jun 23 2019',
      image_url:
        'http://res.cloudinary.com/sidehustle/image/upload/v1561272329/hqdbfkokynnxpy2te26a.png',
    });
    propertyService.createProperty(dummyProperty);
    chai
      .request(server)
      .get('/api/v1/property/1')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql(1);
        done();
      });
  });
  it('should be able to view a specific property', (done) => {
    const dummyProperty = new Property({
      id: 2,
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
    chai
      .request(server)
      .get('/api/v1/property/?type=Flat')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql(1);
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
        expect(res.body.status).to.eql(1);
        done();
      });
  });
  it('should not be able to post properties', (done) => {
    const dummyUser = new User({
      id: 4,
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: 'sam@8888',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: false,
    });
    userService.createUser(dummyUser);
    const property = {
      price: 10009.0,
      state: 'Oyo',
      address: 'Abule EHba',
      city: 'Ibadan',
      type: '2 Bedroom',
      owner: 4,
    };
    chai
      .request(server)
      .post('/api/v1/property')
      .send(property)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        done();
      });
  });
});

describe('Agents', () => {
  it('should be validated before can post', (done) => {
    const dummyUser = new User({
      id: 9,
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: 'sam@8888',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: true,
    });
    userService.createUser(dummyUser);
    const validateAgent = userHelper.checkifAgent(9);
    // eslint-disable-next-line no-unused-expressions
    expect(validateAgent).to.be.true;
    done();
  });
  it('should be able to post properties', (done) => {
    const dummyUser = new User({
      id: 50,
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: 'sam@8888',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: true,
    });
    userService.createUser(dummyUser);
    const property = {
      price: 10009,
      state: 'Oyo',
      address: 'Abule EHba',
      city: 'Ibadan',
      type: '2 Bedroom',
      owner: 50,
      imageData: dummyData.dummyImage(),
    };
    chai
      .request(server)
      .post('/api/v1/property')
      .send(property)
      .end((err, res) => {
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
        done();
      });
  }).timeout(10000);
  it('should be see an error if property price not stated', (done) => {
    const dummyUser = new User({
      id: 50,
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: 'sam@8888',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: true,
    });
    userService.createUser(dummyUser);
    const property = {
      state: 'Oyo',
      address: 'Abule EHba',
      city: 'Ibadan',
      type: '2 Bedroom',
      owner: 50,
      imageData: dummyData.dummyImage(),
    };
    chai
      .request(server)
      .post('/api/v1/property')
      .send(property)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('A valid price/amount is required');
        done();
      });
  }).timeout(10000);
  it('should be see an error if property state address not stated', (done) => {
    const property = {
      price: 10000.0,
      address: 'Abule EHba',
      city: 'Ibadan',
      type: '2 Bedroom',
      owner: 50,
      imageData: dummyData.dummyImage(),
    };
    chai
      .request(server)
      .post('/api/v1/property')
      .send(property)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('Please enter the state where property is located');
        done();
      });
  }).timeout(10000);
  it('should be see an error if wrong file uploaded', (done) => {
    const property = {
      price: 10000.0,
      address: 'Abule EHba',
      city: 'Ibadan',
      type: '2 Bedroom',
      owner: 50,
      imageData: dummyData.dummyImage(),
    };
    chai
      .request(server)
      .post('/api/v1/property')
      .send(property)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        done();
      });
  }).timeout(10000);
  it('should be see an error if no image uploaded', (done) => {
    const property = {
      price: 10000.0,
      state: 'Oyo',
      address: 'Abule EHba',
      city: 'Ibadan',
      type: '2 Bedroom',
      owner: 50,
    };
    chai
      .request(server)
      .post('/api/v1/property')
      .send(property)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.status).to.eql('error');
        expect(res.body.error).to.eql('You need to attach an Image to your property');

        done();
      });
  });
  it('should be able to delete a property', (done) => {
    const dummyProperty = new Property(
      {
        id: 1,
        owner: 1,
        price: 10009,
        state: 'Oyo',
        city: 'Ibadan',
        address: 'Abule EHba',
        type: '2 Bedroom',
        created_on: 'Sun Jun 23 2019',
        image_url:
          'http://res.cloudinary.com/sidehustle/image/upload/v1561272329/hqdbfkokynnxpy2te26a.png',
      },
      {
        id: 2,
        owner: 1,
        price: 10009,
        state: 'Lagos',
        city: 'Lagos',
        address: 'Abule EHba',
        type: '2 Bedroom',
        created_on: 'Sun Jun 23 2019',
        image_url:
          'http://res.cloudinary.com/sidehustle/image/upload/v1561272329/hqdbfkokynnxpy2te26a.png',
      },
    );
    propertyService.createProperty(dummyProperty);
    chai
      .request(server)
      .delete('/api/v1/property/1')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        done();
      });
  });
  it('should see an error if trying to delete an unavailable property', (done) => {
    chai
      .request(server)
      .delete('/api/v1/property/31')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.status).to.eql('error');
        done();
      });
  });
  it('should be able mark a property as sold', (done) => {
    const dummyProperty = new Property({
      id: 1,
      owner: 1,
      price: 10009,
      state: 'Oyo',
      city: 'Ibadan',
      address: 'Abule EHba',
      type: '2 Bedroom',
      created_on: 'Sun Jun 23 2019',
      image_url:
        'http://res.cloudinary.com/sidehustle/image/upload/v1561272329/hqdbfkokynnxpy2te26a.png',
    });
    propertyService.createProperty(dummyProperty);
    chai
      .request(server)
      .patch('/api/v1/property/1/sold')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data.status).to.eql('sold');
        done();
      });
  });
  it('should see an error if trying to mark an unavailable property as sold', (done) => {
    chai
      .request(server)
      .patch('/api/v1/property/19/sold')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.status).to.eql('error');
        done();
      });
  });
  it('should be able to update a property', (done) => {
    const dummyProperty = new Property({
      id: 11,
      owner: 1,
      price: 10009,
      state: 'Oyo',
      city: 'Ibadan',
      address: 'Abule EHba',
      type: '2 Bedroom',
      created_on: 'Sun Jun 23 2019',
      image_url:
        'http://res.cloudinary.com/sidehustle/image/upload/v1561272329/hqdbfkokynnxpy2te26a.png',
    });
    propertyService.createProperty(dummyProperty);
    chai
      .request(server)
      .patch('/api/v1/property/11')
      .send({ price: 20000 })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data.price).to.eql(20000);
        done();
      });
  });
  it('should be see an error if trying to update an unavalable property', (done) => {
    chai
      .request(server)
      .patch('/api/v1/property/120')
      .send({ price: 20000 })
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.status).to.eql('error');
        done();
      });
  });
});
