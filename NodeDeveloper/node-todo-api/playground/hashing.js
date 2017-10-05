const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 4
};

var token = jwt.sign(data, 'somesecret');

console.log(token);

var decoded = jwt.verify(token, 'somesecret');

console.log('Decoded:', decoded);
