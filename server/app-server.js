/* eslint-disable max-len */
const express = require('express');
const config = require('../config.js');
const socket = require('socket.io');
const app = express();
const secureCode = 1234;

// const speaker = {};
const rooms = [];
const questions = [];

// const audiences = [];
const students = new Map();
app.use(express.static('./dist'));
app.use(express.static('public'));


const server = app.listen(config.PORT, config.HOST, function() {
  console.log(`Server running is running at http://${config.HOST}:${config.PORT}`);
});


const io = socket.listen(server);

io.sockets.on('connection', function(socket) {
  socket.on('join', function(payload) {
    // console.log(payload);
    const speaker = {
      id: socket.id,
      name: payload.name,
      type: 'speaker',
      code: generate(4),
    };
    socket.emit('joined', speaker);
    socket.join(speaker.code);
    console.log('rooms before');
    console.log(rooms);
    rooms.push(speaker);
    console.log('rooms after');
    console.log(rooms);
    console.log('speaker');
    console.log(speaker);
  });
  socket.on('joinStudent', function(payload) {
    console.log('Payload');
    console.log(payload.id);
    const fourdigitsrandom = Math.floor(1000 + Math.random() * 9000);
    const student = {
      id: socket.id,
      name: fourdigitsrandom,
      answer: null,
      type: 'student',
      sessionId: payload.id,
    };
    if (students.has(payload.id)) {
      const values = students.get(payload.id);
      values.push(student);
      students.set(payload.id, values);
    } else {
      const newArrayObject = [];
      newArrayObject.push(student);
      students.set(payload.id, newArrayObject);
    }
    console.log(students);
    socket.emit('joined', student);
    socket.join(payload.id);
    io.to(payload.id).emit('updateStudents', students.get(payload.id));
  });
  socket.on('validateSession', function(payload, callback) {
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
  socket.on('validateSessionId', function(payload, callback) {
    console.log(payload);
    const room = rooms.find((o) => o.code === payload.id);
    console.log(room);
    if (room != undefined) {
      callback({
        code: 'OK',
      });
    } else {
      callback({
        code: 'SESSIONCODEERROR',
        msg: `Session ID is wrong!`,
      });
    }
  });
  socket.on('askquestion', function(question) {
    questions.push(question);
    const obj = rooms.find((data) => data.id === socket.id);
    const a = students.get(obj.code);
    for (let i = 0; i < a.length; i++) {
      a[i].answer = null;
    }
    students.set(obj.code, a);
    io.to(obj.code).emit('updateAudience', a);
    console.log('Socket ID askquestion:'+socket.id);
    console.log(rooms);
    console.log(obj);
    io.to(obj.code).emit('askquestion', questions);
  });
});

/**
 * Generate a unique code.
 * @param {length} length The length
 * @return {number} The unique number;
 */
function generate(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result='';
  for (let i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  };
  return result;
}
