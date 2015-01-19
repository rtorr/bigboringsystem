'use strict';

var React = require('react');

var Authenticate = React.createClass({
  render: function () {
    return (
      <div>
        <h1>check your phone</h1>
        {process.env.npm_lifecycle_event === 'dev' || 'watch-js' ?
          <p><strong>Development Mode:</strong> <span>Use {this.props.data.testPin} to login</span></p>
          :
          <p>Enter the 4-digit PIN from your phone to log in.</p>}
        <form method='post' action='/authenticate'>
          <input type='text' name='pin' autocomplete='off' required autofocus />
          {this.props.data.error ? <p>this.props.data.error</p> : ''}
          <input type="hidden" name="crumb" value={this.props.data.crumb} />
          <button type="submit">log in</button>
        </form>
      </div>
    );
  }
});

module.exports = Authenticate;
