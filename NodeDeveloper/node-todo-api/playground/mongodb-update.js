const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB Server');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59ce9b4fd7f74307a02f71b3')
  }, {
    $set: {
      name: 'Ben'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((doc) => {
    console.log(doc);
  });

  db.close();

});
