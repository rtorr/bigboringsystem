'use strict';

var socket;
if (process.env.npm_lifecycle_event === 'dev' || 'watch-js'){
  socket = require('socket.io-client')('http://localhost:3132');
}else {
  socket = require('socket.io-client')('http://localhost');
}

var socketUtil = {
  socket: socket
};

module.exports = socketUtil;
