import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Verify test framework is set up properly', () => {
  it('should verify test framwork is set up by passing', (done) => {
    expect(200).to.eql(200);
    done();
  });
});

describe('Test index page', () => {
  it('should test that the index page is responding', () => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.eql(200);
      });
  });
});
