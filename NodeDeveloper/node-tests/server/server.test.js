const request = require('supertest');
const app = require('./server').app;

it('should return Hello World response', (done) => {

  request(app)
    .get('/')
    .expect('Hello World')
    .end(done);

});
