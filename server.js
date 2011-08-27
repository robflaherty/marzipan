(function() {
  var app, config, dashboard, express, mongo;
  express = require('express');
  app = express.createServer();
  config = require('./config/config');
  mongo = require('mongodb');
  app.listen(config.ping_port);
  app.get('/js', function(req, res) {
    return res.sendfile(__dirname + '/client/build/marzipan.min.js');
  });
  app.get('/ping', function(req, res) {
    return res.sendfile(__dirname + '/client/build/marzipan.min.js');
  });
  if (config.dashboard === true) {
    dashboard = express.createServer();
    dashboard.listen(config.dashboard_port);
    dashboard.use(express.static(__dirname + '/dashboard'));
  }
}).call(this);
