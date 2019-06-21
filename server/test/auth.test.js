import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import { User } from '../models/User';

chai.use(chaiHttp);
const { expect } = chai;

describe('Test User Sign up', () => {
  it('should return 404 on wrong route', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        done();
      });
  });
  it('should validate user email', (done) => {
    const user = new User({
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail',
      phone: '08068170026',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('A valid email is required');
        done();
      });
  });
  it('should ensure user enters acceptable password', (done) => {
    const user = new User({
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '08068170026',
      address: 'Heaven Land street',
      password: '1',
      isAgent: 'false',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(
          'Please enter a password with only text and numbers and at least 6 characters long',
        );
        done();
      });
  });
  it('should ensure user enters a correct phone number', (done) => {
    const user = {
      firstName: 'oooo',
      lastName: 'Samuel',
      email: 'sam@ail.io',
      phoneNumber: '333',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('Please enter a correct 11 digit phone number');
        done();
      });
  });
  it('should return error when characters different from text and numbers are passed in password', (done) => {
    const user = new User({
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '000',
      address: 'Heaven Land street',
      password: '1',
      isAgent: 'false',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(
          'Please enter a password with only text and numbers and at least 6 characters long',
        );
        done();
      });
  });
  it('should return error if lastName is not present ', (done) => {
    const user = new User({
      firstName: 'Sam',
      email: 'sam@mail.io',
      phone: '000',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body.error);
        done();
      });
  });
  it('should return error if firstName is not present ', (done) => {
    const user = new User({
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '000',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body.error);
        done();
      });
  });

  it('should ensure no duplicate email', (done) => {
    const user = new User({
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '000',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body.error);
        done();
      });
  });
  it('should ensure no duplicate phone number', (done) => {
    const user = new User({
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '000',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body.error);
        done();
      });
  });
  it('should post the user data and return the user object, with a correct payload', (done) => {
    const user = {
      firstName: 'oooo',
      lastName: 'Samuel',
      email: 'sam@ail.io',
      phoneNumber: '08068170006',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body.data).to.be.an('object');
        expect(res.body)
          .to.have.property('status')
          .to.eql('success');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('first_name');
        expect(res.body.data).to.have.property('last_name');
        expect(res.body.data).to.have.property('email');
        done();
      });
  });
});

describe('Test User Sign in Route', () => {
  it('should validate user email', (done) => {
    const user = new User({
      email: 'sam@mail',
      password: 'sam1111997',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('A valid email is required');
        done();
      });
  });
  it('should ensure user enters acceptable password', (done) => {
    const user = new User({
      email: 'sam@mail.io',
      password: '1',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(
          'Please enter a password with only text and numbers and at least 6 characters long',
        );
        done();
      });
  });
  it('should return success and token when correct details are passed along', (done) => {
    const user = new User({
      email: 'sam@mail.io',
      password: 'sam1111997',
    });
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.data).to.have.property('token');
        done();
      });
  });
  it('should return error if wrong email or password is passed along', (done) => {
    const user = { email: 'james@mail.com', password: 'police' };
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
