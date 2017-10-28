const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { app } = require('../server');
var { Todo } = require('../models/todo');
var { User } = require('../models/user');

var { testTodos, populateTodos, testUsers, populateUsers} = require('./seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

  it('should create a new todo', () => {

    var text = 'new test todo';

    return request(app)
      .post('/todos')
      .set('x-auth', testUsers[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .then((res) => {

        expect(res.body.text).toBe(text);
        return Todo.find();

      }).then((todos) => {

        expect(todos.length).toBe(testTodos.length + 1);
        expect(todos[todos.length-1].text).toBe(text);

      });

  });

  it('should not create todo with invalid body data', () => {

    return request(app)
      .post('/todos')
      .set('x-auth', testUsers[0].tokens[0].token)
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.name).toBe('ValidationError')

        return Todo.find().then((todos) => {

          expect(todos.length).toBe(testTodos.length);

        });
      });

  });
});

describe('GET /todos', () => {

  it('should get all todos', () => {

    return request(app)
      .get('/todos')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(200)
      .then((res) => {

        expect(res.body.todos.length).toBe(1);

      });

  });

});

describe('GET /todos/:id', () => {

  it('should return todo doc', () => {

      var expected = testTodos[0];

      return request(app)
        .get(`/todos/${expected._id}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .then((res) => {

          expect(res.body.todo._id).toBe(expected._id.toHexString());
          expect(res.body.todo.text).toBe(expected.text);

        });
  });

  it('should not return todo doc created by other user', () => {

      var todo = testTodos[1];  // todo 2 is not owned by user 1
      var user = testUsers[0];

      return request(app)
        .get(`/todos/${todo._id}`)
        .set('x-auth', user.tokens[0].token)
        .expect(404);
  });

  it('should return 404 if todo not found', () => {

    return request(app)
      .get(`/todos/${new ObjectID()}`)
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(404);

  });

  it('should return 400 if todo id not valid', () => {

    return request(app)
      .get('/todos/123')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(400);

  });

});

describe('DELETE /todos/:id', () => {

  it('should delete existing todo', (done) => {

    var expected = testTodos[1];

    request(app)
      .delete(`/todos/${expected._id}`)
      .set('x-auth', testUsers[1].tokens[0].token)
      .expect(200)
      .expect((res) => {

        expect(res.body.todo._id).toBe(expected._id.toHexString());
        expect(res.body.todo.text).toBe(expected.text);

      })
      .end((err, res) => {

        if (err) {
          return done(err);
        }

        Todo.findById(expected._id).then((todo) =>{

          expect(todo).toBeFalsy();
          done();

        }).catch(done);

      });
  });

  it('should not delete existing todo from other user', (done) => {

    var expected = testTodos[1];

    request(app)
      .delete(`/todos/${expected._id}`)
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {

        if (err) {
          return done (err);
        }

        Todo.findById(expected._id).then((todo) => {

          expect(todo).toBeTruthy();
          done();

        }).catch(done);

      });
  });

  it('should return 404 if todo not found', (done) => {

    request(app)
      .delete(`/todos/${new ObjectID()}`)
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(404)
      .end(done);

  });

  it('should return 400 if todo id not valid', (done) => {

    request(app)
      .delete('/todos/123')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(400)
      .end(done);

  });
});

describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {

    var expected = testTodos[0];

    expected.text = "Updated text";
    expected.completed = true;

    var updates = _.pick(expected, [ 'text', 'completed' ]);

    request(app)
      .patch(`/todos/${expected._id}`)
      .set('x-auth', testUsers[0].tokens[0].token)
      .send(updates)
      .expect(200)
      .expect((res) => {

        var todo = res.body.todo;

        expect(typeof todo).toBe('object');
        expect(todo.text).toBe(expected.text);
        expect(todo.completed).toBe(expected.completed);
        expect(typeof todo.completedAt).toBe('number');

        Todo.findById(expected._id).then((doc) => {

          expect(doc).toBeTruthy();
          expect(doc.text).toBe(expected.text);
          expect(doc.completed).toBe(expected.completed);
          expect(doc.completedAt).toBe(todo.completedAt);

        }).catch(done);

      })
      .end(done);

  });

  it('should not update the todo by another user', (done) => {

    var expected = testTodos[0];

    expected.text = "Updated text";
    expected.completed = true;

    var updates = _.pick(expected, [ 'text', 'completed' ]);

    request(app)
      .patch(`/todos/${expected._id}`)
      .set('x-auth', testUsers[1].tokens[0].token)
      .send(updates)
      .expect(404)
      .end(done);

  });

  it('should clear completedAt when not completed', (done) => {

    var expected = testTodos[1];

    expected.completed = false;

    var updates = _.pick(expected, [ 'completed' ]);

    request(app)
      .patch(`/todos/${expected._id}`)
      .set('x-auth', testUsers[1].tokens[0].token)
      .send(updates)
      .expect(200)
      .expect((res) => {

        var todo = res.body.todo;

        expect(typeof todo).toBe('object');
        expect(todo.text).toBe(expected.text);
        expect(todo.completed).toBe(expected.completed);
        expect(todo.completedAt).toBeFalsy();

        Todo.findById(expected._id).then((doc) =>{

          expect(doc).toBeTruthy();
          expect(doc.text).toBe(expected.text);
          expect(doc.completed).toBe(expected.completed);
          expect(doc.completedAt).toBeFalsy();

        }).catch(done);

      })
      .end(done);


  });

});

describe('POST /users', () => {

  it('should create a new user', (done) => {

    var newUser = {
      email: 'newuser@example.com',
      password: 'password'
    };

    request(app)
      .post('/users')
      .send(newUser)
      .expect(200)
      .expect((res) => {
        expect(typeof res.headers['x-auth']).toBe('string');
        expect(res.body.email).toBe(newUser.email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email: newUser.email }).then((user) => {

            expect(user).toBeTruthy();
            expect(user.password).not.toBe(newUser.password);
            done();

        }).catch(done);

      });

  });

  it('should fail with 400 if invalid email address', (done) => {

    request(app)
      .post('/users')
      .send({ email: 'garbage', password: 'password' })
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe('ValidationError');
        expect(res.body.errors).toHaveProperty('email')
      })
      .end(done);

  });

  it('should fail with 400 if password too short', (done) => {

    request(app)
      .post('/users')
      .send({ email: 'newuser@example.com', password: 'pass' })
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe('ValidationError');
        expect(res.body.errors).toHaveProperty('password')
      })
      .end(done);

  });

  it('should fail if email address already in use', (done) => {

      request(app)
        .post('/users')
        .send({ email: testUsers[0].email, password: 'password' })
        .expect(400)
        .end(done);

  });

});

describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {

    request(app)
      .get('/users/me')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(testUsers[0]._id.toHexString());
        expect(res.body.email).toBe(testUsers[0].email);
      })
      .end(done);

  });

  it('should return 401 if not authenticated', (done) => {

    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});

describe('POST /users/login', () => {

  it('should login with valid email and password', (done) => {

    var expected = testUsers[1];

    request(app)
      .post('/users/login')
      .send(_.pick(expected, [ 'email', 'password' ]))
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(expected._id.toHexString());
        expect(res.body.email).toBe(expected.email);
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(expected._id).then((user) => {

          expect(user).toBeTruthy();

          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.header['x-auth']
          });
          done();

        }).catch(done);
      });

  });

  it('should 400 with invalid password', (done) => {

    var expected = testUsers[1];

    request(app)
      .post('/users/login')
      .send({ email: expected.email, password: 'incorrect password' })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(expected._id).then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
        }).catch(done);

      });

  });

});

describe('DELETE /users/me/token', () => {

  it('should remove auth token on logout', (done) => {

    request(app)
      .delete('/users/me/token')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(testUsers[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(done);

      });

  });

});
