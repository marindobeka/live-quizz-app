/* eslint-disable max-len */
const express = require('express');
const config = require('../config.js');
const socket = require('socket.io');
const app = express();

const rooms = [];
const questions = [];
const students = new Map();
app.use(express.static('./dist'));
app.use(express.static('public'));

const server = app.listen(config.PORT, function() {
  console.log(`Server running is running at http://localhost:${config.PORT}`);
});


const io = socket.listen(server);

io.sockets.on('connection', function(socket) {
  socket.once('disconnect', function() {
    const foundIndex = rooms.findIndex((x) => x.id == socket.id);
    if (foundIndex != -1 ) {
      io.sockets.in(rooms[foundIndex].code).emit('end');
      students.delete(rooms[foundIndex].code);
      rooms.splice(foundIndex, 1);
    } else {
      // console.log(socket.id);
      const key = [...students.entries()]
          .filter(({1: v}) => v.findIndex((x) => x.id === socket.id) != -1)
          .map(([k]) => k);
      // console.log(key);
      if (key && key.length > 1) {
        const values = students.get(key[0]);
        // console.log(values);
        const index = values.findIndex((x) => x.id == socket.id);
        values.splice(index, 1);
        students.set(key[0], values);
        io.to(key[0]).emit('updateStudents', values);
      }
    }
    socket.disconnect();
  });
  socket.once('join', function(payload) {
    // console.log(payload);
    const speaker = {
      id: socket.id,
      name: payload.name,
      type: 'speaker',
      code: generate(4),
    };
    socket.join(speaker.code);
    io.to(speaker.code).emit('joined', speaker);
    // console.log('rooms before');
    // console.log(rooms);
    rooms.push(speaker);
    // console.log('rooms after');
    // console.log(rooms);
    // console.log(io.sockets.adapter);
  });
  socket.on('joinStudent', function(payload) {
    // console.log('Payload');
    // console.log(payload.id);

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
    // console.log(students);
    const availableQuestions = questions.filter((data) => data.code === payload.id);
    if (!availableQuestions || !availableQuestions.length) {
      // console.log('joined');
      socket.emit('joined', student);
    } else {
      // console.log('joinedWithQuestionAvailable');
      // console.log(availableQuestions);
      socket.emit('joinedWithQuestionAvailable', {s: student, q: availableQuestions});
    }
    socket.join(payload.id);
    io.to(payload.id).emit('updateStudents', students.get(payload.id));
  });
  socket.on('reloadSpeaker', function(payLoad) {
    // console.log('RELOAD SPEAKER');
    // console.log(payLoad);
    const foundIndex = rooms.findIndex((x) => x.code == payLoad.code);
    if (foundIndex != -1) {
      rooms[foundIndex].id = socket.id; // update the id of the old room.
      // console.log(foundIndex);
      socket.join(payLoad.code);
      socket.emit('welcomeBack', rooms[foundIndex]);
    } else {
      payLoad.id = socket.id;
      socket.join(payLoad.code);
      rooms.push(payLoad);
      socket.emit('welcomeBack', payLoad);
    }
  });
  socket.on('reloadStudent', function(payLoad) {
    // console.log('RELOAD Student');
    // console.log(payLoad);
    const values = students.get(payLoad.sessionId);
    if (values && values.length > 0) {
      const foundIndex = values.findIndex((x) => x.id == payLoad.id);
      const availableQuestions = questions.filter((data) => data.code === payLoad.sessionId);
      if (foundIndex != -1) {
        values[foundIndex].id = socket.id; // update the id of the old room.
        // console.log(foundIndex);
        students.set(payLoad.sessionId, values);
        socket.join(payLoad.sessionId);
        if (availableQuestions && availableQuestions.length) {
          socket.emit('welcomeBackStudentWithQuestionAvailable', {s: values[foundIndex], q: availableQuestions});
        } else {
          socket.emit('welcomeBackStudent', values[foundIndex]);
        }
        io.to(payLoad.sessionId).emit('updateStudents', students.get(payLoad.sessionId));
      } else {
        payLoad.id = socket.id;
        socket.join(payLoad.sessionId);
        values.push(payLoad);
        students.set(payLoad.sessionId, values);
        if (availableQuestions && availableQuestions.length) {
          socket.emit('welcomeBackStudentWithQuestionAvailable', {s: payLoad, q: availableQuestions});
        } else {
          socket.emit('welcomeBackStudent', payLoad);
        }
        io.to(payLoad.sessionId).emit('updateStudents', students.get(payLoad.sessionId));
      }
    }
  });
  socket.on('validateSession', function(payload, callback) {
    const isRoomNameAvailable = rooms.find((o) => o.name === payload.name);
    if (config.MASTER_CODE == payload.code && isRoomNameAvailable == undefined) {
      callback({
        code: 'OK',
      });
    } else if (config.MASTER_CODE != payload.code) {
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
    // console.log(payload);
    const room = rooms.find((o) => o.code === payload.id);
    // console.log(room);
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
    // console.log('Socket ID askquestion:'+socket.id);
    // console.log(rooms);
    // console.log(obj);
    // console.log('Questions: ');
    // console.log(questions);
    io.to(obj.code).emit('askquestion', questions);
  });
  socket.on('sendAnswer', function(payLoad, memeber) {
    // console.log('------------SEND ANSWER----------------');
    // console.log(payLoad);
    // console.log(memeber);
    const values = students.get(memeber.sessionId);
    const foundIndex = values.findIndex((x) => x.id == socket.id);
    const qIndex = questions.findIndex((x) => x.code == memeber.sessionId);
    // console.log(qIndex);
    // console.log(memeber.answer.length);
    // console.log(memeber.answer[0]);
    if (questions[qIndex].question.type != 'textbox') {
      for (let i = 0; i < memeber.answer.length; i++) {
        // console.log(memeber.answer[i]);
        // console.log(questions[qIndex]);
        // console.log(questions[qIndex].results[memeber.answer[i]]);
        questions[qIndex].results[memeber.answer[i]]++;
      }
    }
    // console.log(questions);
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
