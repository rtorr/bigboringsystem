'use strict';

var React = require('react');
var utils = require('./../lib/viewUtils');

var Post = React.createClass({
  render: function () {
    var _this = this;
    var replyUrl = function ( ) {
      if(utils.isUrl(_this.props.data.post.reply)){
        return (
          <a href={_this.props.data.post.reply}>{_this.props.data.post.reply}</a>
        );
      }else {
        return (
          <span>{_this.props.data.post.reply}</span>
        );
      }
    };
    var replyNodes = this.props.data.post.replies.map( function( reply ) {
      return (
        <div>
          {_this.props.data.session && (_this.props.data.session === _this.props.data.post.uid || _this.props.data.op) ?
            <form method="post" action={'/reply/replyto!' + reply.target + '!' + reply.uid} className="moderate">
              <input type="hidden" name="uid" value={_this.props.data.post.uid} />
              <input type="hidden" name="crumb" value={_this.props.data.crumb} />
              <button type="submit">x</button>
            </form>
            : ''}
          <p>
            <a className="time" href={'/post/post!' + reply.postid}><span dateTime={reply.created}>{reply.created}</span></a> -
            <a href={'/user/' + reply.uid}>{reply.name}</a>
          </p>
        </div>
      );
    });
    return (
      <div>
      {this.props.data.session && (this.props.data.session === this.props.data.post.uid || this.props.data.op) ?
        <form method="post" action={'/post/' + this.props.data.id} className="delete">
          <input type="hidden" name="uid" value={this.props.data.post.uid} />
          <input type="hidden" name="crumb" value={this.props.data.crumb} />
          <button type="submit">x delete</button>
        </form>
        : ''}
        <h1><a href={'/user/' + this.props.data.post.uid}>{this.props.data.post.name}</a></h1>
        <article>
          <p><span dateTime={this.props.data.post.created}>{this.props.data.post.created}</span></p>
          {this.props.data.post.reply ?
            <p className="reply">in reply to:&#xa0;{replyUrl()}</p>
            : ''}
          <pre>{this.props.data.post.content}</pre>
          {this.props.data.session ?
            <div className="reply-to-post">
              <a href={'/posts?reply_to=' + this.props.data.id}>Reply to this post</a>
            </div>
            : ''}
          {this.props.data.post.replies && this.props.data.post.replies.length ?
            <div>
              <p className="replies">{'replies:'}</p>
              {replyNodes}
            </div>
            : ''}
        </article>
      </div>
    );
  }
});

module.exports = Post;
