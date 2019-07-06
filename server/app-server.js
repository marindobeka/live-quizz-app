const express = require('express');
const config = require('../config.js');
const socket = require('socket.io');
const app = express();
const secureCode = 1234;

const speaker = {};
const rooms = [];
app.use(express.static('./dist'));
app.use(express.static('public'));


const server = app.listen(config.PORT, config.HOST, function() {
  console.log(`Server running is running at http://${config.HOST}:${config.PORT}`);
});


const io = socket.listen(server);

io.sockets.on('connection', function(socket) {
  socket.on('join', function(payload) {
    console.log(payload);
    speaker.id = socket.id,
    speaker.name = payload.name,
    speaker.type = 'speaker',
    speaker.code = payload.code;
    socket.emit('joined', speaker);
    rooms.push(speaker);
    console.log(speaker);
    console.log(rooms);
  });
  socket.on('validateSession', function(payload, callback) {
    console.log(payload);
    const isRoomNameAvailable = rooms.find((o) => o.name === payload.name);
    console.log(isRoomNameAvailable);
    if (secureCode == payload.code && isRoomNameAvailable == undefined) {
      callback({
        code: 'OK',
      });
    } else if (secureCode != payload.code) {
      callback({
        code: 'SECURECODEERROR',
        msg: `Please enter the default secure code to create a room`,
      });
    } else if (isRoomNameAvailable != undefined) {
      callback({
        code: 'ROOMERROR',
        msg: `Room name is allready used. Please use another one.`,
      });
    }
  });
});
