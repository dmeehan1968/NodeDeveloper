console.log('Starting app.js');

const fs = require('fs');
const os = require('os');
const _ = require('lodash');
const notes = require('./notes.js');

var res = notes.add(9, -2);
console.log(res);

// var user = os.userInfo();
//
// fs.appendFile('greetings.txt', `Hello ${user.username}! You are ${notes.age}\n`, function(err) {
//   if (err) {
//     console.log('Unable to write to file');
//   }
// });
