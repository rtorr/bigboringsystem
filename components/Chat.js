'use strict';

var React = require('react');
var ChatStore = require('./../flux/stores/ChatStore');
var socket = require('./../lib/socketUtil').socket;
var Chat = React.createClass({

  getInitialState: function() {
    return ChatStore.getChatData();
  },
  getStateFromStores: function() {
    return ChatStore.getChatData();
  },
  componentDidMount: function() {
    ChatStore.addChangeListener(function(){
      var state = this.getStateFromStores();
      this.setState(state);
    }.bind(this));
    var node = this.refs.chat.getDOMNode();
    node.scrollTop = node.scrollHeight;
  },
  componentWillUpdate: function() {
    var node = this.refs.chat.getDOMNode();
    this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) - node.scrollHeight > -1;
  },
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.refs.chat.getDOMNode();
      node.scrollTop = node.scrollHeight;
    }
  },
  handleSubmit: function(e){
    e.preventDefault();
    var message = this.refs.message.getDOMNode().value.trim();
    socket.emit('message', message);
    this.refs.message.getDOMNode().value = '';
  },
  render: function () {
    var userNodes = this.state.users.map(function (user){
      return (
        <a href={'/users/' + user.uid} target="_blank" title={user.name}>{user.name}</a>
      );
    });
    var messageNodes = this.state.messages.map(function (message){
      return (
        <p><span className="timestamp">{message.timestamp}</span><strong>{message.name}</strong>: {message.message}</p>
      );
    });
    return (
      <div>
        <h1>public chat</h1>
        <ul id="users">
          {userNodes}
        </ul>
        <div id="chat" ref="chat">
          {messageNodes}
        </div>
        <form id="chat-form" onSubmit={this.handleSubmit}>
          <input type="text" id="message" name="message" autoComplete="off" autoFocus ref="message"/>
          <button type="submit" id="send-message">Send</button>
        </form>
      </div>
    );
  }
});

module.exports = Chat;
