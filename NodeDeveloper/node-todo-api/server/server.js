require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

function recurseRoutes(app, folder, root) {

  var entries = fs.readdirSync(folder);
  entries.forEach((entry) => {
    var subpath = path.join(folder, entry);
    var stat = fs.statSync(subpath);
    if (stat.isDirectory()) {
      recurseRoutes(app, subpath, path.join(root, entry));
    } else {
      var { name: method } = path.parse(subpath);
      console.log('Registering Route:', method.toUpperCase(), root);
      var middleware = require(subpath);
      app[method](root, ...middleware);

    }
  });

}

recurseRoutes(app, path.join(__dirname, './routes'), '/');

app.get('/todos', authenticate, async (req, res) => {

  try {

    const todos = await Todo.find({ _creator: req.user._id });
    res.send({ todos });

  } catch(e) {

    res.status(400).send(e);

  }

});

app.get('/todos/:id', authenticate, async (req, res) => {

  var id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send();
  }

  try {

      const todo = await Todo.findOne({
          _id: id,
          _creator: req.user._id
        });

      if (!todo) {
        return res.status(404).send();
      }

      res.status(200).send({ todo });

  } catch(e) {

    res.status(404).send();

  }

});

app.delete('/todos/:id', authenticate, async (req, res) => {

  try {

    var id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send();
    }

    const todo = await Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
      });

    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({ todo });

  } catch(e) {

    res.status(404).send();

  }

});

app.patch('/todos/:id', authenticate, async (req, res) => {

  var id = req.params.id;
  var body = _.pick(req.body, [ 'text', 'completed' ]);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  try {

    const todo = await Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
      }, {
        $set: body
      },
      { new: true });

    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });

  } catch (e) {

    res.status(404).send();

  }

});

app.get('/users/me', authenticate, (req, res) => {

    res.send(req.user);

});

app.delete('/users/me/token', authenticate, async (req, res) => {

  try {

    await req.user.removeToken(req.token);
    res.status(200).send();

  } catch(e) {

    res.status(400).send();

  }

});

app.listen(port, () => {

  console.log(`Started on ${port}`);

});

module.exports = {
  app
};
