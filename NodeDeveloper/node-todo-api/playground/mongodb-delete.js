const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB Server');

  // deleteMany
  // db.collection('Todos').deleteMany({ text: 'eat lunch' }).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({ text: 'eat lunch' }).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
  //     console.log(result);
  // });

  // deleteMany
  // db.collection('Users').deleteMany({ name: 'Andrew' });

  db.collection('Todos').findOneAndDelete( {
    _id: new ObjectID('59d116f42e708dfc3a86a439')
  }).then((results) => {
      console.log(results);
  });

  // db.close();

});
