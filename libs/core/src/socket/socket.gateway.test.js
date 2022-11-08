/* eslint-disable */
const io = require('socket.io-client');
console.log('start');
const socket = io('http://127.0.0.1:5400/');

socket.on('connect', () => {
  console.log(socket.id);
});

socket.on('disconnect', () => {
  console.log(socket.id); // undefined
});

socket.on('msgToClient', data => {
  console.log('on msgToClient', {data});
});

setInterval(() => {
  console.log('emit msgToServer 123');
  socket.emit('msgToServer', 123);
  socket.emit('msgToChat', 321);
}, 2000);
