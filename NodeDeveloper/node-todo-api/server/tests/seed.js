const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

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

var seedTodos = () => {

  return Todo.remove({}).then(() => Todo.insertMany(testTodos))

};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const testUsers = [
  {
    _id: userOneId,
    email: 'dave@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userOneId, access: 'auth' }, 'somesecret').toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'andrew@example.com',
    password: 'userTwoPass'
  }
];

var seedUsers = () => {

  return User.remove({}).then(() => User.insertMany(testUsers))

};

module.exports = {
  testUsers, seedUsers, testTodos, seedTodos
}
