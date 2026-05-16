const request = require('supertest');
const { app, server } = require('../index'); 

describe('GET / - Test Coverage', () => {

  after((done) => {
    server.close(done);
  });

  it('should return 200 OK for root route', (done) => {
    request(app)
      .get('/')
      .expect(200, done); 
  });

  it('should hide X-Powered-By header', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        if (res.headers['x-powered-by']) {
          return done(new Error('Leak information!'));
        }
        done();
      });
  });
});