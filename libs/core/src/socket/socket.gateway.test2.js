/* eslint-disable */
const io = require('socket.io-client');
console.log('start');
const baseUrl = 'http://192.168.1.228:3001/socket/';
const mappingUrlTopic = {
  setting: 'app-face-threshold',
  'read-history': 'passenger-document',
  sync: 'sync-status',
}

function createClient(tailUrl, topic) {
  console.log({ tailUrl, topic });
  const socket = io(baseUrl + tailUrl);
  const prefixMsg = () => new Date().toISOString() + ` [${socket.id} ${tailUrl}] `;
  socket.on('connect', () => console.log(prefixMsg() + 'connect'));
  socket.on('disconnect', () => console.log(prefixMsg() + 'disconnect'));
  socket.on(topic, data => console.log(prefixMsg() + `on ${topic}: `, { data }));
}

for (const [key, value] of Object.entries(mappingUrlTopic)) {
  createClient(key, value);
}
