const request = require('supertest');
const expect = require('expect');

const app = require('./server').app;

it('should return error page', (done) => {

  request(app)
    .get('/')
    .expect(404)
    .expect((res) => {
      expect(res.body).toInclude({
        error: 'Page not found.',
        name: 'Todo App v1.0'
      });
    })
    .end(done);

});

it('should return users', (done) => {

  request(app)
    .get('/users')
    .expect(200)
    .expect((res) => {
      expect(res.body)
        .toBeA('array')
        .toInclude({ name: 'Dave', age: 49 });
    })
    .end(done);

});
