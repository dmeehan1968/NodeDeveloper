require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');
const { mongoose } = require('./db/mongoose');

const { resolveRoutes } = require('./utils/resolveRoutes');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

const byUri = (a, b) => {
  if (a.uri < b.uri) {
    return -1;
  }
  if (a.uri > b.uri) {
    return 1;
  }

  return 0;
};

resolveRoutes(path.join(__dirname, 'routes'))
.sort(byUri)
.forEach((route) => {
  console.log('Registering Route:', route.method, route.uri);
  app[route.method.toLowerCase()](route.uri, require(route.module));
})

app.listen(port, () => console.log(`Started on ${port}`));

module.exports = {
  app
};
