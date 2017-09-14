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
  var note = notes.addNote(argv.title, argv.body);
  if (note !== undefined) {
    console.log('Added:', note.title);
  } else {
    console.log('Duplicate note');
  }
} else if (command === 'list') {
  notes.getAll();
} else if (command === 'read') {
  notes.getNote(argv.title);
} else if (command === 'remove') {
  notes.removeNote(argv.title);
} else {
  console.log('Command not recognised');
}
