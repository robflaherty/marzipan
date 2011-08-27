express = require 'express'
app     = express.createServer()
config  = require './config/config'
mongo   = require 'mongodb'

# db = new mongo.Db('test', new mongo.Server('localhost', 27017, {}), {});

app.listen(config.ping_port)

# Serve tracking JS
app.get '/js', (req, res) ->
  res.sendfile(__dirname + '/client/build/marzipan.min.js')

# Ping
app.get '/ping', (req, res) ->
  res.sendfile(__dirname + '/client/build/marzipan.min.js')

if config.dashboard is on
  dashboard = express.createServer()
  dashboard.listen(config.dashboard_port)
  dashboard.use(express.static(__dirname + '/dashboard'));


