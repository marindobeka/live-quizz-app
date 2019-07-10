/* eslint-disable max-len */
const express = require('express');
const config = require('../config.js');
const socket = require('socket.io');
const app = express();
const secureCode = 1234;

const rooms = [];
const questions = [];
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
    const availableQuestions = questions.filter((data) => data.code === payload.id);
    if (!availableQuestions || !availableQuestions.length) {
      console.log('joined');
      socket.emit('joined', student);
    } else {
      console.log('joinedWithQuestionAvailable');
      console.log(availableQuestions);
      socket.emit('joinedWithQuestionAvailable', {s: student, q: availableQuestions});
    }
    socket.join(payload.id);
    io.to(payload.id).emit('updateStudents', students.get(payload.id));
  });
  socket.on('reloadSpeaker', function(payLoad) {
    console.log('RELOAD SPEAKER');
    console.log(payLoad);
    const foundIndex = rooms.findIndex((x) => x.code == payLoad.code);
    if (foundIndex != -1) {
      rooms[foundIndex].id = socket.id; // update the id of the old room.
      console.log(foundIndex);
      socket.emit('welcomeBack', rooms[foundIndex]);
    }
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
  socket.on('askquestion', function(payload) {
    const obj = rooms.find((data) => data.id === socket.id);
    const q = {
      code: obj.code,
      question: payload,
    };
    questions.push(q);
    if (students.has(obj.code)) {
      const a = students.get(obj.code);
      for (let i = 0; i < a.length; i++) {
        a[i].answer = null;
      }
      students.set(obj.code, a);
      io.to(obj.code).emit('updateStudents', a);
    }
    console.log('Socket ID askquestion:'+socket.id);
    console.log(rooms);
    console.log(obj);
    io.to(obj.code).emit('askquestion', questions);
  });
  socket.on('sendAnswer', function(payLoad, memeber) {
    console.log(payLoad);
    console.log(memeber);
    const values = students.get(memeber.sessionId);
    const foundIndex = values.findIndex((x) => x.id == socket.id);
    values[foundIndex] = memeber;
    // values[foundIndex].answer = memeber;
    // const member = _.findWhere(values, {id: this.id});
    // values.splice(values.indexOf(member), 1, memeber);
    students.set(memeber.sessionId, values);
    io.to(memeber.sessionId).emit('updateStudents', values);
    // _.set(_.find(values, {id: this.id}), 'answer', memeber.answer);
    // let member = _.findWhere(audiences, {id: this.id});

    // audiences.splice(audiences.indexOf(member), 1, memeber);
    // _.set(_.find(audiences, {id: this.id}), 'answer', memeber.answer);
    // var member1 = _.findWhere(audiences, {id : this.id});
    // console.log('server member after:' + member1.id);
    // console.log('server member after:' + member1.answer);

    // var json = JSON.parse(payLoad.answer);
    // console.log('answer: ' + Object.values(json));
    // const obj = rooms.find((data) => data.code === member.room);
    // io.to(speaker.code).emit('updateAudience', audiences);
    // io.sockets.emit('updateAudience', audiences);
    // console.log('server member:' + member.id);
    // io.sockets.emit('results', questions);
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
