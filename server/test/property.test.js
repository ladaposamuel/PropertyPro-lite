import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import { User, userService } from '../models/User';
import userHelper from '../helpers/userHelper';

chai.use(chaiHttp);
const { expect } = chai;

describe('Users', () => {
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
      id: 5,
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
      price: 10009.0,
      state: 'Oyo',
      address: 'Abule EHba',
      city: 'Ibadan',
      type: '2 Bedroom',
      owner: 5,
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
        done();
      });
  });
  it('should be see an error if property price not stated', (done) => {
    const property = {
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
        expect(res.body.error).to.eql('A valid price/amount is required');
        done();
      });
  });
  it('should be see an error if property state address not stated', (done) => {
    const property = {
      price: 10000.0,
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
        expect(res.body.error).to.eql('Please enter the state where property is located');
        done();
      });
  });
});
