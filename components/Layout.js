'use strict';

var React = require('react');
var Router = require('react-router');

var Layout = React.createClass({

  getDefaultProps: function() {
    return {
      data: global.layoutData
    };
  },

  handleSubmit: function(e){
    e.preventDefault();
    console.log('WHAT THE FUCK');
  },

  render: function () {
    var View = this.props.view ? this.props.view : Router.RouteHandler;
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
                <li><a href="/discover">discover</a></li>
                <li><a href="/links">more</a></li>
                <li><a href="/logout">log out</a></li>
                {this.props.tips ? this.props.tips : ''}
              </ul>
            </div>
            : <ul className="actions"></ul>}
          </section>
          <div className="content">
            <View data={this.props.data} />
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
