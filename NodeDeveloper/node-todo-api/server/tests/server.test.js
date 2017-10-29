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

  it('should delete existing todo', () => {

    var expected = testTodos[1];

    return request(app)
      .delete(`/todos/${expected._id}`)
      .set('x-auth', testUsers[1].tokens[0].token)
      .expect(200)
      .then((res) => {

        expect(res.body.todo._id).toBe(expected._id.toHexString());
        expect(res.body.todo.text).toBe(expected.text);

        return Todo.findById(expected._id).then((todo) =>{

          expect(todo).toBeFalsy();

        });

      });

  });

  it('should not delete existing todo from other user', () => {

    var expected = testTodos[1];

    return request(app)
      .delete(`/todos/${expected._id}`)
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(404)
      .then((res) => {

        return Todo.findById(expected._id).then((todo) => {

          expect(todo).toBeTruthy();

        });

      });
  });

  it('should return 404 if todo not found', () => {

    return request(app)
      .delete(`/todos/${new ObjectID()}`)
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(404);

  });

  it('should return 400 if todo id not valid', () => {

    return request(app)
      .delete('/todos/123')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(400);

  });
});

describe('PATCH /todos/:id', () => {

  it('should update the todo', () => {

    var expected = testTodos[0];

    expected.text = "Updated text";
    expected.completed = true;

    var updates = _.pick(expected, [ 'text', 'completed' ]);

    return request(app)
      .patch(`/todos/${expected._id}`)
      .set('x-auth', testUsers[0].tokens[0].token)
      .send(updates)
      .expect(200)
      .then((res) => {

        var todo = res.body.todo;

        expect(typeof todo).toBe('object');
        expect(todo.text).toBe(expected.text);
        expect(todo.completed).toBe(expected.completed);
        expect(typeof todo.completedAt).toBe('number');

        return Todo.findById(expected._id).then((doc) => {

          expect(doc).toBeTruthy();
          expect(doc.text).toBe(expected.text);
          expect(doc.completed).toBe(expected.completed);
          expect(doc.completedAt).toBe(todo.completedAt);

        });

      });

  });

  it('should not update the todo by another user', () => {

    var expected = testTodos[0];

    expected.text = "Updated text";
    expected.completed = true;

    var updates = _.pick(expected, [ 'text', 'completed' ]);

    return request(app)
      .patch(`/todos/${expected._id}`)
      .set('x-auth', testUsers[1].tokens[0].token)
      .send(updates)
      .expect(404);

  });

  it('should clear completedAt when not completed', () => {

    var expected = testTodos[1];

    expected.completed = false;

    var updates = _.pick(expected, [ 'completed' ]);

    return request(app)
      .patch(`/todos/${expected._id}`)
      .set('x-auth', testUsers[1].tokens[0].token)
      .send(updates)
      .expect(200)
      .then((res) => {

        var todo = res.body.todo;

        expect(typeof todo).toBe('object');
        expect(todo.text).toBe(expected.text);
        expect(todo.completed).toBe(expected.completed);
        expect(todo.completedAt).toBeFalsy();

        return Todo.findById(expected._id).then((doc) =>{

          expect(doc).toBeTruthy();
          expect(doc.text).toBe(expected.text);
          expect(doc.completed).toBe(expected.completed);
          expect(doc.completedAt).toBeFalsy();

        });

      });

  });

});

describe('POST /users', () => {

  it('should create a new user', () => {

    var newUser = {
      email: 'newuser@example.com',
      password: 'password'
    };

    return request(app)
      .post('/users')
      .send(newUser)
      .expect(200)
      .then((res) => {
        expect(typeof res.headers['x-auth']).toBe('string');
        expect(res.body.email).toBe(newUser.email);

        return User.findOne({ email: newUser.email }).then((user) => {

            expect(user).toBeTruthy();
            expect(user.password).not.toBe(newUser.password);

        });
      });

  });

  it('should fail with 400 if invalid email address', () => {

    return request(app)
      .post('/users')
      .send({ email: 'garbage', password: 'password' })
      .expect(400)
      .then((res) => {
        expect(res.body.name).toBe('ValidationError');
        expect(res.body.errors).toHaveProperty('email')
      });

  });

  it('should fail with 400 if password too short', () => {

    return request(app)
      .post('/users')
      .send({ email: 'newuser@example.com', password: 'pass' })
      .expect(400)
      .then((res) => {
        expect(res.body.name).toBe('ValidationError');
        expect(res.body.errors).toHaveProperty('password')
      });

  });

  it('should fail if email address already in use', () => {

      return request(app)
        .post('/users')
        .send({ email: testUsers[0].email, password: 'password' })
        .expect(400);

  });

});

describe('GET /users/me', () => {

  it('should return user if authenticated', () => {

    return request(app)
      .get('/users/me')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(200)
      .then((res) => {
        expect(res.body._id).toBe(testUsers[0]._id.toHexString());
        expect(res.body.email).toBe(testUsers[0].email);
      });

  });

  it('should return 401 if not authenticated', () => {

    return request(app)
      .get('/users/me')
      .expect(401)
      .then((res) => {
        expect(res.body).toEqual({});
      });
  });

});

describe('POST /users/login', () => {

  it('should login with valid email and password', () => {

    var expected = testUsers[1];

    return request(app)
      .post('/users/login')
      .send(_.pick(expected, [ 'email', 'password' ]))
      .expect(200)
      .then((res) => {
        expect(res.body._id).toBe(expected._id.toHexString());
        expect(res.body.email).toBe(expected.email);
        expect(res.headers['x-auth']).toBeTruthy();

        return User.findById(expected._id).then((user) => {

          expect(user).toBeTruthy();

          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.header['x-auth']
          });

        });

      });

  });

  it('should 400 with invalid password', () => {

    var expected = testUsers[1];

    return request(app)
      .post('/users/login')
      .send({ email: expected.email, password: 'incorrect password' })
      .expect(400)
      .then((res) => {
        expect(res.headers['x-auth']).toBeFalsy();

        return User.findById(expected._id).then((user) => {

            expect(user.tokens.length).toBe(1);

        });
      });

  });

});

describe('DELETE /users/me/token', () => {

  it('should remove auth token on logout', () => {

    return request(app)
      .delete('/users/me/token')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(200)
      .then((res) => {

        return User.findById(testUsers[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);

        });

      });

  });

});
