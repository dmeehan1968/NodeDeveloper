var getUser = (id, callback) => {

  var user = {
    id: id,
    name: 'Vikram'
  };

  setTimeout(() => {
    callback(user);
  }, 3000);
  
};

getUser('123', (user) => {
  console.log(user);
});
