'use strict';

var React = require('react');
var utils = require('./../lib/viewUtils');

var Discover = React.createClass({
  render: function () {
    var replyUrl = function (s) {
      if(utils.isUrl(s)){
        return (
          <a href={s}>{s}</a>
        );
      }else {
        return (
          <span>{s}</span>
        );
      }
    };
    var postNodes = this.props.data.posts.map(function(post){
      return (
        <article key={post.key}>
          <a className="title" href={'/post/post!' + post.value.postid}>
            <span dateTime={post.value.created}>{post.value.created}</span>
          </a>
          <p className="posted">posted by&#xa0; <a href={'/user/' + post.value.uid}>{post.value.name}</a></p>
          {post.value.reply ?
            <p className="reply">in reply to:&#xa0;{replyUrl(post.value.reply)}</p>
            : ''}
          <pre>{post.value.content}</pre>
        </article>
      );
    });
    return (
      <div>
        <h1>discover</h1>
        {postNodes}
        <div className="pagination">
          {this.props.data.next && this.props.data.lastKey ?
            <a href={'/discover?last=' + this.props.data.lastKey}>older</a>
            : ''}
        </div>
      </div>
    );
  }
});

module.exports = Discover;
