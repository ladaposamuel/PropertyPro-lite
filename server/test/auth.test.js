import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import { User, userService } from '../models/User';

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
    const dummyUser = new User({
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: 'sam@8888',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: true,
    });
    userService.createUser(dummyUser);
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
    const dummyUser = new User({
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'sam@mail.io',
      phone: 'sam@8888',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: true,
    });
    userService.createUser(dummyUser);
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
describe('Test User Password Reset', () => {
  it('should send user reset email', (done) => {
    const user = userService.fetchUserById(1);
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({ type: 'request', email: user.email })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body)
          .to.have.property('status')
          .to.eql('success');
        expect(res.body.message).to.eql('Email sent. Check your inbox');
        expect(res.body.token).to.be.a('string');
        done();
      });
  });
  it('should return error if user not found', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({ email: 'james@sam.io' })
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        done();
      });
  });
  it('should ensure user provides a valid email', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({ type: 'request', email: '' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        done();
      });
  });
  it('should return status 400 if request type is missing', (done) => {
    const user = userService.fetchUserById(1);
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: user.email,
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.error).to.eql('Request type must be specified');
        done();
      });
  });
  it('should return status 400 if password not set', (done) => {
    const user = userService.fetchUserById(1);
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: user.email,
        token: 'token',
        type: 'reset',
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body.error).to.eql('Provide a new password');
        done();
      });
  });
  it('should return status 400 if token not set', (done) => {
    const user = userService.fetchUserById(1);
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: user.email,
        password: 'newPass',
        type: 'reset',
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body.error).to.eql('No token is provided');
        done();
      });
  });
  it('should return error with wrong reset token', (done) => {
    const user = userService.fetchUserById(1);
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: user.email,
        token: 'token',
        password: 'newPass',
        type: 'reset',
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');
        expect(res.body.error).to.eql('Invalid token');
        done();
      });
  });
  it('should reset user password', (done) => {
    const user = userService.fetchUserById(1);
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: user.email,
        token: user.resetToken,
        password: 'newPass',
        type: 'reset',
      })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body)
          .to.have.property('status')
          .to.eql('success');
        done();
      });
  });
  it('should check reset expiry time', (done) => {
    const user = userService.fetchUserById(1);
    userService.updateUser(
      {
        resetTime: 999999999,
      },
      1,
    );
    chai
      .request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: user.email,
        token: user.resetToken,
        password: 'newPass',
        type: 'reset',
      })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('error');

        done();
      });
  });
});
