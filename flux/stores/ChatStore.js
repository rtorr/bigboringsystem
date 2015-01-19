'use strict';

var BBSDispatcher = require('./../dispatcher/BBSDispatcher');
var Store = require('./Store');
var Constants = require('../constants/Constants');
var merge = require('amp-merge');
var socket = require('./../../lib/socketUtil').socket;
var muted = [];
var getChatSessionStorage = [];
if (typeof window !== 'undefined'){
  muted = JSON.parse(JSON.stringify(window.sessionStorage.getItem('muted')));
  getChatSessionStorage = JSON.parse(window.sessionStorage.getItem('chat'));
}

var ChatData = {
  data: {
    name: undefined,
    messages: [],
    users: []
  },
  clonedData: function ( ){
    return JSON.parse(JSON.stringify(this.data));
  }
};

var ChatStore = merge(Store, {
  getChatData: function (){
    return ChatData.clonedData();
  }
});

var _setDataProp = function (key, value){
  ChatData.data[key] = value;
  return ChatData.clonedData();
};

var _setNewMessage = function (value){
  ChatData.data.messages.push(value);
  if (ChatStore.getChatData().messages.length > 99){
    ChatData.data.messages.shift();
  }
  return ChatData.clonedData();
};

var _updateUsersList = function (data){
  var u = [];
  for (var user in data) {
    u.push({
      uid: user,
      name: data[user]
    });
  }
  ChatData.data.users = u;
  return ChatData.clonedData();
};

var formatTime = function (date) {
  if (date > 9) {
    return date;
  }
  return '0' + date;
};

var setChatMessage = function (data){
  var time;
  if (data.timestamp) {
    var date = new Date(data.timestamp);
    var hours = formatTime(date.getHours());
    var minutes = formatTime(date.getMinutes());
    var seconds = formatTime(date.getSeconds());
    time = '[' + hours + ':' + minutes + ':' + seconds + '] ';
  }
  _setNewMessage({
    timestamp: (time ? time : ''),
    name: data.name,
    message: data.message
  });
};

for (var i in getChatSessionStorage){
  setChatMessage(getChatSessionStorage[i]);
}

socket.on('message', function (data) {
  setChatMessage(data);
  ChatStore.emitChange();
});

socket.on('users', function (data) {
  _updateUsersList(data);
  ChatStore.emitChange();
});

socket.on('name', function (data) {
  _setDataProp('name', data);
  ChatStore.emitChange();
});

socket.on('connect', function () {
  socket.emit('user');
});

ChatStore.dispatchToken = BBSDispatcher.register(function(action){

});

module.exports = ChatStore;
