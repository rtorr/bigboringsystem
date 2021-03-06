'use strict';

var React = require('react');
var Router = require('react-router');

require('./query-string');
var qs = window.queryString.parse(location.search);
var port = location.port ? ':' + location.port : '';

if (qs.reply_to) {
  var protocol = location.protocol;
  var hostname = location.hostname;
  var postid = qs.reply_to;
  global.replyto = protocol + '//' + hostname + port + '/post/' + postid;
}

var Layout = require('./../../components/Layout');
var Index = require('./../../components/Index');
var Authenticate = require('./../../components/Authenticate');
var Posts = require('./../../components/Posts');
var Post = require('./../../components/Post');
var Chat = require('./../../components/Chat');
var Discover = require('./../../components/Discover');
var Links = require('./../../components/Links');
var Profile = require('./../../components/Profile');

var routes = (
  <Router.Route handler={Layout} path="/">
    <Router.DefaultRoute handler={Index} />
    <Router.Route name="authenticate" handler={Authenticate} />
    <Router.Route name="posts" handler={Posts} />
    <Router.Route name="post" path="/post/:postId" handler={Post} />
    <Router.Route name="chat" handler={Chat} />
    <Router.Route name="discover" handler={Discover} />
    <Router.Route name="links" handler={Links} />
    <Router.Route name="profile" handler={Profile} />
  </Router.Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler />, document.getElementById('main'));
});
