const express = require('express');
const config = require('../config.js');
const socket = require('socket.io');
const app = express();


app.use('/', express.static('./dist', {
  index: 'index.html',
}));
app.use(express.static('public'));


app.listen(config.port, config.host, () => {
  return console.log(`Server running is running at http://${config.host}:${config.port}`);
});

const io = socket(server);

io.on('connection', function(socket) {
  console.log('Socket Connection Established with ID :'+ socket.id);
});
