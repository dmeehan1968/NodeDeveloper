console.log('Starting notes.js');

var addNote = (title, body) => {
  console.log('Adding a new Note with title="',title, '", body="',body, '"');
  return 'new note';
}

var getAll = () => {
  console.log('Getting all notes');
}

var get = (title) => {
  console.log('Getting note', title);
}

module.exports = {
  addNote,
  getAll,
  get
}
