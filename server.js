(function() {
  var app, cache, config, dashboard, db, express, flushCache, mongo, pushCache, _;
  express = require('express');
  config = require('./config/config');
  mongo = require('mongodb');
  _ = require('./vendor/underscore');
  app = express.createServer();
  db = new mongo.Db('test', new mongo.Server('localhost', 27017, {}), {});
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
    var data;
    if (_.isEmpty(cache)) {
      return;
    }
    data = cache;
    cache = {};
    console.log(data);
    db.open(function(err, client) {
      client.collection("users", function(err, col) {
        var prop;
        for (prop in data) {
          col.update({
            user: prop
          }, {
            $pushAll: {
              pageviews: data[prop]
            }
          }, {
            upsert: true
          }, function() {});
        }
        db.close();
      });
    });
  };
  app.listen(config.ping_port);
  app.get('/ping', function(req, res) {
    pushCache(req.query);
    return res.send(204);
  });
  setInterval(flushCache, 5000);
  app.get('/js', function(req, res) {
    return res.sendfile(__dirname + '/client/marzipan.js');
  });
  if (config.dashboard === true) {
    dashboard = express.createServer();
    dashboard.listen(config.dashboard_port);
    dashboard.use(express.static(__dirname + '/dashboard'));
  }
}).call(this);
