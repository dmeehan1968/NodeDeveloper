var socket = io();

socket.on('connect', function () {

    console.log('Connected to server');

    socket.emit('createEmail', {
      to: 'recipient@example.com',
      text: 'message body'
    })

});

socket.on('disconnect', function () {

  console.log('Disconnected from server');

});

socket.on('newEmail', function (email) {

  console.log('newEmail', email);

});
