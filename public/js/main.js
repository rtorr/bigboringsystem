'use strict';

var React = require('react');
var Layout = require('./../../components/Layout');
var Index = require('./../../components/Index');

var view;

switch(window.layout){
  case 'index':
    view = Index;
    break;
}

React.render(
  <Layout view={view} data={window.layoutData}/>,
  document.getElementById('main')
);
