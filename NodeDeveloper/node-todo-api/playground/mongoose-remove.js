const { ObjectID } = require('mongodb');

var { mongoose } = require('../server/db/mongoose');
var { Todo } = require('../server/models/todo');
var { User } = require('../server/models/user');

Todo.remove({}).then((results) => {
  console.log(results);
});
