(function() {
  var cache, express, flushCache, mongo, pushCache, root, server, _;
  root = this;
  express = require('express');
  server = express.createServer();
  mongo = require('mongodb');
  _ = require('../vendor/underscore');
  cache = {};
  pushCache = function(data) {
    var user;
    user = data.user;
    data.timestamp = Date.now() + '';
    delete data.user;
    if (!cache[user]) {
      cache[user] = [];
    }
    cache[user].push(data);
  };
  flushCache = function() {
    var db;
    db = new mongo.Db('test', new mongo.Server('localhost', 27017, {}), {});
    db.open(function(err, client) {
      client.collection("users", function(err, col) {
        var prop;
        for (prop in cache) {
          col.insert({
            user: prop,
            pageviews: cache[prop]
          }, function() {});
        }
      });
    });
  };
  server.get('/image.gif', function(req, res) {
    pushCache(req.query);
    return res.send(204);
  });
  server.listen(3000);
  setInterval(flushCache, 2000);
}).call(this);
