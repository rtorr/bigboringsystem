'use strict';

var React = require('react');

var Main = React.createClass({

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
        {!this.props.data.session ?
          <div>
            <h2>enter your phone number to sign in</h2>
            <form method="post" action="/login">
            {process.env.npm_lifecycle_event === 'dev' || 'watch-js' ?
              <p>Development Mode: Enter any valid phone number (no text will be sent)</p>
              :
              <div>
                <p>Enter your number without spaces or dashes</p>
                <p>You may need to prepend with + for non-U.S/Canadian numbers</p>
              </div>}
              <input type="tel" name="phone" required="true"/>
              {this.props.error ? <p>{this.props.error}</p> : ''}
              <input type="hidden" name="crumb" value={this.props.data.crumb} />
              <button type="submit">send my PIN</button>
            </form>
          </div>
          : ''}
      </div>
    );
  }
});

module.exports = Main;
