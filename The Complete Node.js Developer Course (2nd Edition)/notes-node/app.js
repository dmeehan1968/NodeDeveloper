console.log('Starting app.js');

const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

const notes = require('./notes.js');

var argv = yargs.argv;

console.log(argv);

var command = argv._[0];
console.log('Command: ', command);

if (command === 'add') {
  notes.addNote(argv.title, argv.body);
} else if (command === 'list') {
  notes.getAll();
} else if (command === 'read') {
  notes.get(argv.title);
} else if (command === 'remove') {
  notes.remove(argv.title);
} else {
  console.log('Command not recognised');
}
