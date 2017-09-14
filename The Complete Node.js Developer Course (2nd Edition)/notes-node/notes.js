console.log('Starting notes.js');

const fs = require('fs');

var addNote = (title, body) => {

  var notes = getAll();

  var note = {
    title,
    body
  };

  var duplicateNotes = notes.filter((note) => note.title === title);

  if (duplicateNotes.length === 0) {

    console.log('Adding a new Note with title="',title, '", body="',body, '"');

    notes.push(note);

    fs.writeFileSync('notes-data.json', JSON.stringify(notes));

  } else {
    console.log('Duplicate note title');
  }

  return note;
}

var getAll = () => {
  console.log('Getting all notes');

  try {

    return JSON.parse(fs.readFileSync('notes-data.json'));

  } catch(e) {

    return [];
  }
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
