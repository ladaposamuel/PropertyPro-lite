import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

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
});
