'use strict';

var Dispatcher = require('flux/lib/Dispatcher');
var extend = require('amp-extend');
var queue = require('queue');

var _action_queue = queue({
  concurrency: 1
});
var BBSDispatcher = new Dispatcher();
extend(BBSDispatcher, {
  _dispatch: BBSDispatcher.dispatch,
  dispatch: function(action) {
    _action_queue.push(function(cb) {
      this._dispatch(action);
      cb();
    }.bind(this));
    _action_queue.start();
  }
});
module.exports = BBSDispatcher;
