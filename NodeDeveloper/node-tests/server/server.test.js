const request = require('supertest');
const app = require('./server').app;

it('should return Hello World response', (done) => {

  request(app)
    .get('/')
    .expect(404)
    .expect({
      error: 'Page not found.'
    })
    .end(done);

});
