'use strict';

var level = require('level');
var Boom = require('boom');
var concat = require('concat-stream');
var moment = require('moment');
var nconf = require('nconf');

var crypto = require('crypto');
var services = require('./services');
var utils = require('./utils');

nconf.argv().env().file({ file: 'local.json' });

var MAX_POSTS = 10;

var db;
exports.setDB = function (dbPath) {
  db = level(dbPath || './db/posts', {
    createIfMissing: true,
    valueEncoding: 'json'
  });
};

exports.setDB();

var getTime = function () {
  return Math.floor(Date.now() / 1000);
};

exports.db = function () {
  return db;
};

exports.add = function (request, reply) {
  var time = getTime();
  var uid = request.session.get('uid');
  var name = request.session.get('name');

  if (!utils.isUrl(request.payload.reply)) {
    return reply.redirect('/posts?err=Please+enter+a+valid+URL');
  }

  if (!uid) {
    return reply.redirect('/');
  }

  if (!name) {
    return reply.redirect('/profile');
  }

  var postItem = {
    uid: uid,
    name: name,
    created: time,
    title: request.payload.title,
    reply: request.payload.reply
  };

  var postid = time + '-' + crypto.randomBytes(1).toString('hex');

  var getId = function () {

    db.get('post!' + postid, function (er, result) {

      if (result && postid.length > (time.length + 8)) {
        // srsly wtf? math is broken? trillions of active users?
        return reply(Boom.wrap('please try later', 503));
      }

      if (result) {
        postid += crypto.randomBytes(1).toString('hex');
        return getId();
      }

      // got an id that isn't taken!  w00t!
      postItem.postid = postid;
      return savePost();
    });
  };

  var savePost = function () {
    console.log('|||')
    db.put('user!' + request.session.get('uid') + '!' + postid, postItem, function (err, post) {
      if (err) {
        return reply(Boom.wrap(err, 400));
      }

      db.put('post!' + postid, postItem, function (err) {
        if (err) {
          return reply(Boom.wrap(err, 400));
        }

        reply.redirect('/posts');
      });
    });
  };

  getId();
};

var setDate = function (created) {
  return moment(created * 1000).format('MMM Do, YYYY - HH:mm a');
};

var setPagination = function (defaultKey, request, next) {
  var key;
  var cs = db.createKeyStream({
    gte: defaultKey,
    limit: 1
  });

  cs.on('error', function (err) {
    return next(err);
  });

  cs.on('data', function (data) {
    key = data;
  });

  cs.on('end', function () {
    var uid = request.session.get('uid');
    var streamOpt = {
      gte: defaultKey,
      limit: MAX_POSTS,
      reverse: true
    };

    if (request.query.last) {
      streamOpt.lt = request.query.last;
    } else {
      streamOpt.lte = defaultKey + '\xff';
    }

    return next(null, {
      stream: streamOpt,
      finalKey: key
    });
  });
};

exports.getAllRecent = function (request, reply) {
  setPagination('post!', request, function (err, streamOpt) {
    if (err) {
      return reply(Boom.wrap(err, 400));
    }

    var rs = db.createReadStream(streamOpt.stream);

    rs.pipe(concat(function (posts) {
      var firstKey = false;
      var lastKey = false;

      if (posts.length) {
        firstKey = posts[0].key;
        lastKey = posts[posts.length - 1].key;
      }

      return reply.view('discover', {
        firstKey: firstKey,
        lastKey: lastKey,
        next: (streamOpt.finalKey !== lastKey),
        analytics: nconf.get('analytics'),
        session: request.session.get('uid'),
        posts: posts.map(function (post) {
          post.value.created = setDate(post.value.created);
          return post;
        })
      });
    }));

    rs.on('error', function (err) {
      return reply(Boom.wrap(err, 400));
    });
  });
};

exports.getAllByUser = function (uid, next) {
  var rs = db.createReadStream({
    gte: 'user!' + uid,
    lte: 'user!' + uid + '\xff'
  });

  var getFeedPost = function (uid, posts, next) {
    var feedArr = [];
    var count = 0;

    if (posts.length < 1) {
      return next(null, []);
    }

    posts.forEach(function (post) {
      var fs = db.createReadStream({
        gte: 'post!' + post.value.created,
        lte: 'post!' + post.value.created + '\xff'
      });

      fs.pipe(concat(function (feed) {
        feed.forEach(function (fd) {
          count ++;
          if (fd.value.uid === uid) {
            feedArr.push(fd);
          }

          if (count === feed.length) {
            return next(null, feedArr);
          }
        });
      }));

      fs.on('error', function (err) {
        return next(err);
      });
    });
  };

  rs.pipe(concat(function (posts) {
    getFeedPost(uid, posts, function (err, feed) {
      if (err) {
        return next(Boom.wrap(err, 400));
      }

      return next(null, {
        feed: feed,
        posts: posts
      });
    });
  }));

  rs.on('error', function (err) {
    return next(Boom.wrap(err, 400));
  });
};

exports.getRecent = function (request, reply) {
  var uid = request.session.get('uid');
  var urlError = request.url.query.err;

  setPagination('user!' + uid + '!', request, function (err, streamOpt) {
    if (err) {
      return reply(Boom.wrap(err, 400));
    }

    var rs = db.createReadStream(streamOpt.stream);

    rs.pipe(concat(function (posts) {
      var firstKey = false;
      var lastKey = false;

      if (posts.length) {
        firstKey = posts[0].key;
        lastKey = posts[posts.length - 1].key;
      }

      posts = posts.map(function (post) {
        post.value.created = setDate(post.value.created);
        return post;
      });

      return reply.view('posts', {
        error: urlError,
        firstKey: firstKey,
        lastKey: lastKey,
        next: (streamOpt.finalKey !== lastKey),
        analytics: nconf.get('analytics'),
        session: uid,
        posts: posts
      });
    }));

    rs.on('error', function (err) {
      return reply(Boom.wrap(err, 400));
    });
  });
};

exports.getRecentForUser = function (uid, request, next) {
  setPagination('user!' + uid + '!', request, function (err, streamOpt) {
    if (err) {
      return next(err);
    }

    var rs = db.createReadStream(streamOpt.stream);

    rs.pipe(concat(function (posts) {
      var firstKey = false;
      var lastKey = false;

      if (posts.length) {
        firstKey = posts[0].key;
        lastKey = posts[posts.length - 1].key;
      }

      posts = posts.map(function (post) {
        post.value.created = setDate(post.value.created);
        return post;
      });

      next(null, {
        firstKey: firstKey,
        lastKey: lastKey,
        paginate: (streamOpt.finalKey !== lastKey),
        posts: posts
      });
    }));

    rs.on('error', function (err) {
      next(err);
    });
  });
};

exports.del = function (request, reply) {
  if (request.session && (request.session.get('uid') === request.payload.uid) || request.session.get('op')) {
    var keyArr = request.params.key.split('!');
    var time = keyArr[keyArr.length - 1];

    db.del('post!' + time, function (err) {
      if (err) {
        return reply(Boom.wrap(err, 404));
      }

      db.del('user!' + request.payload.uid + '!' + time);
      reply.redirect('/posts');
    });
  } else {
    reply.redirect('/');
  }
}

exports.get = function (request, reply) {
  db.get(request.params.key, function (err, post) {
    if (err) {
      return reply(Boom.wrap(err, 404));
    }

    post.created = setDate(post.created);

    reply.view('post', {
      analytics: nconf.get('analytics'),
      id: request.params.key,
      session: request.session.get('uid') || false,
      op: request.session.get('op'),
      post: post
    });
  });
};
