'use strict';
var urlRegex = require('url-regex');

exports.isUrl = function (text){
  return urlRegex().test(text);
};