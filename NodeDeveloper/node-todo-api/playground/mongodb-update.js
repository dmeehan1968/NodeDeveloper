const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB Server');

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('59d11ddf2e708dfc3a86a588')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((doc) => {
    console.log(doc);
  });

  db.close();

});
