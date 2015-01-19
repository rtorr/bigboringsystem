'use strict';

var React = require('react');

var Posts = React.createClass({
  getDefaultProps: function() {
    return {
      replyto: global.replyto || ''
    };
  },
  render: function () {
    var postNodes = this.props.data.posts.map( function( post ) {
      return (
        <article key={post.key}>
          <a className="time" href={'/post/post!' + post.value.postid}>
            <span dateTime={post.value.created}>{post.value.created}</span>
          </a>
         {post.value.reply ?
           <p className="reply">in reply to:&#xa0;{post.value.reply}</p>
           : ''}
          <pre>{post.value.content}</pre>
        </article>
      );
    });
    return (
      <div>
        <h1>my posts</h1>
        <form method="post" action="/post">
          <label>{'reply links to previous posts? (space delimited)'}
            <input id="reply-to" type="text" name="reply" defaultValue={this.props.replyto}/>
          </label>
          <label>content
            <textarea rows="10" cols="90" name="content" required="true"></textarea>
          </label>
          <label>show replies to this post
            {this.props.data.user.showreplies ?
              <input type="checkbox" name="showreplies" defaultChecked/>
              :
              <input type="checkbox" name="showreplies"/>}
          </label>
          <p>{this.props.data.error ? this.props.data.error : ''}</p>
          <input type="hidden" name="crumb" value={this.props.data.crumb}/>
          <button type="submit">save</button>
        </form>
        <div id="posts">
          {postNodes}
          <div className="pagination">
          {this.props.data.next && this.props.data.lastKey ?
            <a href={'/posts?last=' + this.props.data.lastKey}>older</a> : ''}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Posts;
