const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { app } = require('../server');
var { Todo } = require('../models/todo');
var { User } = require('../models/user');

const testTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }
];

const testUsers = [
  {
    email: 'dave@example.com',
    password: 'password'
  },
  {
    email: 'andrew@example.com',
    password: 'password'
  }
];

beforeEach((done) => {

  Todo.remove({})
    .then(() => Todo.insertMany(testTodos))
    .then(() => User.remove({}))
    .then(() => User.insertMany(testUsers))
    .then(() => done());

});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {

    var text = 'test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {

        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {

            expect(todos.length).toBe(testTodos.length + 1);
            expect(todos[todos.length-1].text).toBe(text);
            done();
        }).catch((e) => done(e));

      });

  });

  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe('ValidationError')
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {

          expect(todos.length).toBe(testTodos.length);
          done();

        }).catch((e) => done(e));

      });
  });
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {

        request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {

            expect(res.body.todos.length).toBe(testTodos.length);

          })
          .end((err, res) => {

              if (err) {
                return done(err);
              }

              done();

          });

    });

});

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {

      var expected = testTodos[0];

      request(app)
        .get(`/todos/${expected._id}`)
        .expect(200)
        .expect((res) => {

          expect(res.body.todo).toBeA('object');
          expect(res.body.todo.text).toBe(expected.text);

        })
        .end(done);
  });

  it('should return 404 if todo not found', (done) => {

    request(app)
      .get(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done);

  });

  it('should return 400 if todo id not valid', (done) => {

    request(app)
      .get('/todos/123')
      .expect(400)
      .end(done);

  });

});

describe('DELETE /todos/:id', () => {

    it('should delete existing todo', (done) => {

      var expected = testTodos[0];

      request(app)
        .delete(`/todos/${expected._id}`)
        .expect(200)
        .expect((res) => {

          expect(res.body.todo).toBeA('object');
          expect(res.body.todo.text).toBe(expected.text);

          Todo.findById(expected._id).then((todo) =>{

            expect(todo).toNotExist();

          }).catch(done);

        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {

      request(app)
        .delete(`/todos/${new ObjectID()}`)
        .expect(404)
        .end(done);

    });

    it('should return 400 if todo id not valid', (done) => {

      request(app)
        .delete('/todos/123')
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
      .send(updates)
      .expect(200)
      .expect((res) => {

        var todo = res.body.todo;

        expect(todo).toBeA('object');
        expect(todo.text).toBe(expected.text);
        expect(todo.completed).toBe(expected.completed);
        expect(todo.completedAt).toBeA('number');

        Todo.findById(expected._id).then((doc) =>{

          expect(doc).toExist();
          expect(doc.text).toBe(expected.text);
          expect(doc.completed).toBe(expected.completed);
          expect(doc.completedAt).toBeA('number').toBe(todo.completedAt);

        }).catch(done);

      })
      .end(done);

  });

  it('should clear completedAt when not completed', (done) => {

    var expected = testTodos[1];

    expected.completed = false;

    var updates = _.pick(expected, [ 'completed' ]);

    request(app)
      .patch(`/todos/${expected._id}`)
      .send(updates)
      .expect(200)
      .expect((res) => {

        var todo = res.body.todo;

        expect(todo).toBeA('object');
        expect(todo.text).toBe(expected.text);
        expect(todo.completed).toBe(expected.completed);
        expect(todo.completedAt).toNotExist();

        Todo.findById(expected._id).then((doc) =>{

          expect(doc).toExist();
          expect(doc.text).toBe(expected.text);
          expect(doc.completed).toBe(expected.completed);
          expect(doc.completedAt).toNotExist();

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
        expect(res.headers).toIncludeKey('x-auth');
        expect(res.headers['x-auth']).toBeA('string');
        expect(res.body.email).toBe(newUser.email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find().then((users) => {

            expect(users.length).toBe(testUsers.length + 1);
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
        expect(res.body.errors).toIncludeKey('email')
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
        expect(res.body.errors).toIncludeKey('password')
      })
      .end(done);

  });

});
