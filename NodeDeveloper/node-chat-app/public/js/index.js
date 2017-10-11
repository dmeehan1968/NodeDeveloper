var socket = io();

socket.on('connect', function () {

    console.log('Connected to server');

});

socket.on('disconnect', function () {

  console.log('Disconnected from server');

});

socket.on('newMessage', function (message) {

  console.log('New message', message);

});

socket.emit('createMessage', {
  from: 'Dave',
  text: 'Hello world'
}, function (message) {
  console.log('Got it', message);
});
