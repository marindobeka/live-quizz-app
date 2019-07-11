/* eslint-disable max-len */
const express = require('express');
const config = require('../config.js');
const socket = require('socket.io');
const app = express();
const secureCode = 1234;

const rooms = [];
const questions = [];
const results = [];
const students = new Map();
app.use(express.static('./dist'));
app.use(express.static('public'));


const server = app.listen(config.PORT, config.HOST, function() {
  console.log(`Server running is running at http://${config.HOST}:${config.PORT}`);
});


const io = socket.listen(server);

io.sockets.on('connection', function(socket) {
  socket.once('disconnect', function() {
    connections.splice(connections.indexOf(socket), 1);
    let member = _.findWhere(audiences, {id: this.id});
    if (member) {
      audiences.splice(audiences.indexOf(member), 1);
      io.sockets.emit('updateAudience', audiences);
    } else if (this.id == speaker.id) {
      const foundIndex = rooms.findIndex((x) => x.id == socket.id);
      socket.to(rooms[foundIndex].code).emit('speakerLeft', room[foundIndex]);
      rooms.splice(foundIndex, 1);
    }
    socket.disconnect();
  });
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
    if (students.has(obj.code)) {
      const a = students.get(obj.code);
      for (let i = 0; i < a.length; i++) {
        a[i].answer = null;
      }
      students.set(obj.code, a);
      io.to(obj.code).emit('updateStudents', a);
    }
    const indexQ = questions.findIndex((x) => x.code == obj.code);
    if (indexQ != -1) {
      questions.splice(indexQ, 1);
    }
    let createAnswers = null;
    if (payload.type && (payload.type === 'radio' || payload.type ==='checkbox')) {
      createAnswers = payload.answers.reduce((acc, elem) => {
        acc[elem] = 0;
        return acc;
      }, {});
    }
    const q = {
      code: obj.code,
      question: payload,
      results: createAnswers,
    };
    questions.push(q);
    console.log('Socket ID askquestion:'+socket.id);
    console.log(rooms);
    console.log(obj);
    console.log('Questions: ');
    console.log(questions);
    io.to(obj.code).emit('askquestion', questions);
  });
  socket.on('sendAnswer', function(payLoad, memeber) {
    console.log('------------SEND ANSWER----------------');
    console.log(payLoad);
    console.log(memeber);
    const values = students.get(memeber.sessionId);
    const foundIndex = values.findIndex((x) => x.id == socket.id);
    const qIndex = questions.findIndex((x) => x.code == memeber.sessionId);
    console.log(qIndex);
    console.log(memeber.answer.length);
    console.log(memeber.answer[0]);
    for (let i = 0; i < memeber.answer.length; i++) {
      console.log(memeber.answer[i]);
      console.log(questions[qIndex]);
      console.log(questions[qIndex].results[memeber.answer[i]]);
      questions[qIndex].results[memeber.answer[i]]++;
    }
    console.log(questions);
    values[foundIndex] = memeber;
    students.set(memeber.sessionId, values);
    io.to(memeber.sessionId).emit('updateStudents', values);
    io.to(memeber.sessionId).emit('updateQuestions', questions);
  });
});

/**
 * Generate a unique code.
 * @param {length} length The length
 * @return {number} The unique number;
 */
function generate(length) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result='';
  for (let i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  };
  return result;
}
