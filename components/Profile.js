'use strict';

var React = require('react');

var Profile = React.createClass({

  render: function () {
    console.log(this.props.data.user && this.props.data.user.name, this.props.data.user.name, this.props.data.crumb);
    var secondaryPhoneNummberNodes = (function(number){
      var a = []
      for (number in this.props.data.user.secondary){
        a.push(<p>********{number.lastTwo}</p>);
      }
      return a;
    });
    return (
      <div>
        <h1>profile</h1>
        <p>Your UID: {this.props.data.user.uid}</p>
        <form method="post" action="/profile">
          {this.props.data.error ? <p>{this.props.data.error}</p> : ''}
          <label>name*
            <input
              type='text'
              name='name'
              defaultValue={this.props.data.user && this.props.data.user.name ? this.props.data.user.name : ''}
              required="true"/>
          </label>
          <label>websites (space delimited)
            <input type="text" name="websites"
              defaultValue={this.props.data.user && this.props.data.user.websites ? this.props.data.user.websites : ''}/>
          </label>
          <label>bio
            <textarea rows="5" cols="50" name="bio" defaultValue={this.props.data.user && this.props.data.user.bio ? this.props.data.user.bio : ''}></textarea>
          </label>
          <label>show replies to this post
            {this.props.data.user.showreplies ?
              <input type="checkbox" name="showreplies" defaultChecked/>
              :
              <input type="checkbox" name="showreplies"/>}
          </label>
          <input type="hidden" name="crumb" value={this.props.data.crumb}/>
          <button type="submit">save</button>
        </form>
        <form method="post" action="/add_phone">
          <label>add a second phone number to this account
            <input type="tel" name="phone" defaultValue={this.props.data.phone}/>
          </label>
          {this.props.data.phone ?
            <label>enter the PIN sent to your secondary phone for validation
              <input type="text" name="pin"/>
            </label>
            : ''}
          <input type="hidden" name="crumb" value={this.props.data.crumb}/>
          <button type="submit">add</button>
        </form>
        <h2>secondary numbers</h2>
        {secondaryPhoneNummberNodes}
        <h2>export posts</h2>
        <a href="/profile/export.json">.json</a> | &#xa0;<a href="/profile/export.csv">.csv</a>
        {this.props.data.op && !this.props.data.userOp ?
          <div>
            <h2 className="delete-account">Delete account</h2>
            <p>If you delete this account, all posts associated with this will be removed.</p>
            <form method="post" action="/deleteaccount">
              <input type="hidden" name="uid" value={this.props.data.session}/>
              <input type="hidden" name="crumb" value={this.props.data.crumb}/>
              <button type="submit">delete account</button>
            </form>
          </div>
          : this.props.session ?
            <div>
              <h2 className="delete-account">Delete account</h2>
              <p>Please contact an operator to delete your account</p>
            </div>
          : ''}
      </div>
    );
  }
});

module.exports = Profile;
