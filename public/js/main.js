'use strict';

var React = require('react');
var Router = require('react-router');
var Layout = require('./../../components/Layout');
var Index = require('./../../components/Index');
var Authenticate = require('./../../components/Authenticate');
var Posts = require('./../../components/Posts');

var routes = (
  <Router.Route handler={Layout} path="/">
    <Router.DefaultRoute handler={Index} />
    <Router.Route name="authenticate" handler={Authenticate} />
    <Router.Route name="posts" handler={Posts} />
  </Router.Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler />, document.getElementById('main'));
});
