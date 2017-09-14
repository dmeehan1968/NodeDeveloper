console.log('Starting notes.js');

const fs = require('fs');

var fetchNotes = () => {

  try {

    return JSON.parse(fs.readFileSync('notes-data.json'));

  } catch(e) {

    return [];
  }

};

var saveNotes = (notes) => {

  fs.writeFileSync('notes-data.json', JSON.stringify(notes));

};

var addNote = (title, body) => {

  var notes = fetchNotes();

  var note = {
    title,
    body
  };

  var duplicateNotes = notes.filter((note) => note.title === title);

  if (duplicateNotes.length === 0) {

    notes.push(note);
    saveNotes(notes);
    return note;

  }

};

var getAll = () => {
  console.log('Getting all notes');

  return fetchNotes();

};

var getNote = (title) => {

  var notes = fetchNotes();

  return notes.filter((note) => note.title === title);

};

var removeNote = (title) => {

  var notes = fetchNotes();
  var filteredNotes = notes.filter((note) => note.title !== title);
  saveNotes(filteredNotes);

  return notes.length !== filteredNotes.length;

};

module.exports = {
  addNote,
  getAll,
  getNote,
  removeNote
};
