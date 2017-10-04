var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/Todo');
var { User } = require('./models/User');

var app = express();
var port = process.env.PORT || 3000;

app.listen(port, () => {

  console.log(`Started on ${port}`);

});
