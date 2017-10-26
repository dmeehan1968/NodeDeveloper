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
