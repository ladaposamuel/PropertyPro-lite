import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Verify API documention is live', () => {
  it('should verify test framwork is set up by passing', (done) => {
    chai
      .request(server)
      .get('/swagger.json')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        done();
      });
  });
  it('verify docs route is active', (done) => {
    chai
      .request(server)
      .get('/docs')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        done();
      });
  });
});
