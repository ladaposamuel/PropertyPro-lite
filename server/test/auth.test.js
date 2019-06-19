import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

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
    const user = {
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@ail',
      phone: '08068170026',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('A valid email is required');
        done();
      });
  });
  it('should ensure user enters acceptable password', (done) => {
    const user = {
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '08068170026',
      address: 'Heaven Land street',
      password: '1',
      isAgent: 'false',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
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
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '080681726',
      address: 'Heaven Land street',
      password: 'sam33333',
      isAgent: 'false',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('Please enter a correct 11 digit phone number');
        done();
      });
  });
  it('should return error when characters different from text and numbers are passed in password', (done) => {
    const user = {
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '08068170006',
      address: 'Heaven Land street',
      password: '1',
      isAgent: 'false',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
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
    const user = {
      firstName: 'Sam',
      email: 'sam@mail.io',
      phone: '08068170006',
      address: 'Heaven Land street',
      password: '1',
      isAgent: 'false',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body.error);
        done();
      });
  });
  it('should return error if firstName is not present ', (done) => {
    const user = {
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '08068170006',
      address: 'Heaven Land street',
      password: '1',
      isAgent: 'false',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
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
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: '08068170006',
      address: 'Heaven Land street',
      password: 'sam22222',
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
