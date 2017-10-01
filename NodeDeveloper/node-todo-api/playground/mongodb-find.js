const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB Server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('59ce9ac39128ac078781e6aa')
  //   }).toArray().then((docs) => {
  //
  //   console.log(JSON.stringify(docs, undefined, 2));
  //
  // }, (err) => {
  //
  //   console.log('Unable to find documents');
  //
  // });

  db.collection('Todos').find().count().then((count) => {

    console.log(`Todos: ${count}`);

  }, (err) => {

    console.log('Unable to find documents');

  });

  // db.close();

});
