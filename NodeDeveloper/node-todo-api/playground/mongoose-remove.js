const { ObjectID } = require('mongodb');

var { mongoose } = require('../server/db/mongoose');
var { Todo } = require('../server/models/todo');
var { User } = require('../server/models/user');

// Todo.remove({}).then((results) => {
//   console.log(results);
// });

// Todo.findOneAndRemove()

Todo.findByIdAndRemove('59d536181281ad0318d9e0bf').then((todo) => {
  console.log(todo);
});
