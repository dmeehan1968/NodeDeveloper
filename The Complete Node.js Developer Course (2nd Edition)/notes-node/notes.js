console.log('Starting notes.js');

const fs = require('fs');

var addNote = (title, body) => {
  console.log('Adding a new Note with title="',title, '", body="',body, '"');

  var notes = [];

  var note = {
    title,
    body
  };

  notes.push(note);

  fs.writeFileSync('notes-data.json', JSON.stringify(notes));

  return note;
}

var getAll = () => {
  console.log('Getting all notes');
}

var getNote = (title) => {
  console.log('Getting note', title);
}

var removeNote = (title) => {
  console.log('Removing note', title);
}

module.exports = {
  addNote,
  getAll,
  getNote,
  removeNote
}
