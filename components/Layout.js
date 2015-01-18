'use strict';

var React = require('react');

var Layout = React.createClass({


  handleSubmit: function(e){
    e.preventDefault();
    console.log('WHAT THE FUCK');
  },

  render: function () {
    return (
      <div>
        <header>
          <p><a href="/">B.B.S.</a></p>
        </header>
        <div className="wrapper cf">
          <section>
          {this.props.data.session ?
            <div>
              <ul className="actions">
                <li><a href="/posts">my posts</a></li>
                <li><a href="/chat">chat</a></li>
                <li><a href="/discover">Discoverd</a></li>
                <li><a href="/links">more</a></li>
                <li><a href="/logout">log out</a></li>
                {this.props.tips ? this.props.tips : ''}
              </ul>
            </div>
            : ''}
          </section>
          <div className="content">
            <this.props.view data={this.props.data} />
            {this.props.login ? this.props.login : ''}
            {this.props.data.session ?
              <div>
                <h2>enter your phone number to sign in</h2>
                <form method="post" action="/login">
                  {process.env.npm_lifecycle_event === 'dev' ?
                    <p>Development Mode: Enter any valid phone number (no text will be sent)</p>
                    :
                    <div>
                      <p>Enter your number without spaces or dashes</p>
                      <p>You may need to prepend with + for non-U.S/Canadian numbers</p>
                    </div>}
                    <input type="tel" name="phone" required="true"/>
                    {this.props.error ? <p>{this.props.error}</p> : ''}
                    <input type="hidden" name="crumb" value={this.props.crumb} />
                    <button type="submit">send my PIN</button>
                </form>
              </div>
              : ''}
            <div className="footer">
              <p>Powered by&#xa0;<a href="https://github.com/bigboringsystem/bigboringsystem">B.B.S.</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Layout;
