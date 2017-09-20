var getUser = (id, callback) => {

  var user = {
    id: id,
    name: 'Vikram'
  };

  callback(user);

};

getUser('123', (user) => {
  console.log(user);
});
