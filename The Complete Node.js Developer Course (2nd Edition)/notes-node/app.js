console.log('Starting app.js');

const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

const notes = require('./notes.js');

var titleOptions = {
  describe: 'Title of note',
  demand: true,
  alias: 't'
};

var bodyOptions = {
  describe: 'Body of the note',
  demand: true,
  alias: 'b'
}

var argv = yargs
  .command('add', 'Add a new note', {
    title: titleOptions,
    body: bodyOptions
  })
  .command('list', 'List all notes')
  .command('read', 'Display an existing note', {
    title: titleOptions
  })
  .command('remove', 'Remove a note', {
    title: titleOptions
  })
  .help()
  .argv;

console.log(argv);

var command = argv._[0];
console.log('Command: ', command);

if (command === 'add') {
  var note = notes.addNote(argv.title, argv.body);
  if (note !== undefined) {
    console.log('Note Created');
    notes.logNote(note);
  } else {
    console.log('Duplicate note');
  }
} else if (command === 'list') {
  var allNotes = notes.getAll();
  console.log(`Printing ${allNotes.length} notes:`);
  allNotes.forEach((note) => {
    notes.logNote(note);
  });
} else if (command === 'read') {

  var fetchedNotes = notes.getNote(argv.title);
  var note = fetchedNotes[0];
  if (note !== undefined) {
    console.log('Note Read');
    notes.logNote(note);
  } else {
    console.log('Note not found');
  }

} else if (command === 'remove') {
  if (notes.removeNote(argv.title)) {
    console.log('Note removed');
  } else {
    console.log('Unknown note title');
  }
} else {
  console.log('Command not recognised');
}
