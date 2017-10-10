const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

var { Todo } = require('../models/todo');
var { User } = require('../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const testUsers = [
  {
    _id: userOneId,
    email: 'dave@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'andrew@example.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
  }
];

const populateUsers = (done) => {

  User.remove({}).then(() => {
    var users = [];

    testUsers.forEach((user) => {
      users.push(new User(user).save());
    });

    Promise.all(users).then(() => done());

  });

};

const testTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }
];

const populateTodos = (done) => {

  Todo.remove({}).then(() => Todo.insertMany(testTodos)).then(() => done());

};


module.exports = {
  testUsers, populateUsers, testTodos, populateTodos
}
