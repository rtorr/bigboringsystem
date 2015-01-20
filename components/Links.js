'use strict';

var React = require('react');

var Links = React.createClass({


  render: function () {
    return (
      <div>
        <ul className="links">
          <li><a href="/profile">your profile</a></li>
          <li><a href="/users">community listing</a></li>
          <li><a href="/privacy">privacy policy</a></li>
        </ul>
      </div>
    );
  }
});

module.exports = Links;
