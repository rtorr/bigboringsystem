'use strict';

var React = require('react');

var Main = React.createClass({

  propTypes: {
    //scroll: React.PropTypes.bool
  },

  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {
  },

  componentWillUnmount: function () {
  },

  render: function () {

    var houseRules = function() {
      return (
        <div>
          <h2>house rules</h2>
          <ol>
            <li>Abusive/annoying/obnoxious behavior will risk in a ban on your phone number.</li>
            <li>Offensive and/or inappropriate posts can be deleted by operators.</li>
            <li>This is a community for people to share interests and have light chat.
              If you don't like it, go set up your&#xa0;<a href="https://github.com/bigboringsystem/bigboringsystem">own</a>.</li>
          </ol>
        </div>
      );
    };

    return (
      <div>
      {this.props.data.session ?
        <div>
          <h1>dashboard</h1>
          <article>
            <p>Welcome to the Big Boring System Inc.</p>
            <p>Feel free to post something you want to share with everyone, chat with the community or browse other posts.</p>
            <p>Here's our&#xa0;<a href="/privacy">privacy policy</a>.</p>
          </article>
        </div>
        :
        <div>
          <h1>big boring system</h1>
          {this.props.data.session.disableSignups ?
            <div>
              <h2>Important:</h2>
              <h3>NEW SIGNUPS ARE CURRENTLY DISABLED.</h3>
            </div>
            : ''}
          <article>
            <p>Welcome to the Big Boring System Inc.</p>
            <p>This is a text-only online community. Feel free to browse&#xa0;<a href="/discover">recent posts</a>.</p>
            <p>THere's our&#xa0;<a href="/privacy">privacy policy</a>.</p>
          </article>
        </div>}
        {houseRules()}
      </div>
    );
  }
});

module.exports = Main;
