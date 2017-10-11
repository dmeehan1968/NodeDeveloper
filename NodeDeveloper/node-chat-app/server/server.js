const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const jqueryPath = path.join(__dirname, '../node_modules/jquery/dist');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
app.use('/libs/jquery', express.static(jqueryPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

  socket.on('createMessage', (message, callback) => {

    console.log('Create message', message);

    socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));

    if (typeof callback === 'function') {
      callback('This is from the server');
    }
  });

  socket.on('disconnect', () => {

    console.log('User was Disconnected');

  });

});

server.listen(port, () => {

  console.log('Server started on port', port);

});
