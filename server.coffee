express = require 'express'
config  = require './config/config'
mongo   = require 'mongodb'
_       = require './vendor/underscore'

#
# Record pings
#

# Server and DB connection
app = express.createServer()
db = new mongo.Db('test', new mongo.Server('localhost', 27017, {}), {});

# Local cache
cache = {}

# Push pageview into cache onto user key
pushCache = (data) ->
  user = data.user
  data.timestamp = Date.now() + ''
  
  delete data.user
  
  if (!cache[user])
    cache[user] = []
  cache[user].push(data)
  return

# Flush the cache to mongo
flushCache = () ->
  return if _.isEmpty(cache)
  
  data = cache
  cache = {}
  console.log data
        
  db.open (err, client) ->
    client.collection "users", (err, col) ->
      for prop of data
        col.update( {user: prop}, {$pushAll: { pageviews: data[prop] }}, {upsert: true}, () -> )
      db.close()
      return
    return
  return

# Set listening port
app.listen(config.ping_port)

# Ping
app.get '/ping', (req, res) ->
  pushCache(req.query)
  res.send(204)

# Flush cache every 3 seconds
setInterval(flushCache, 3000)

#
# Tracking JS
#
app.get '/js', (req, res) ->
  res.sendfile(__dirname + '/client/marzipan.js')

#
# Dashboard
#
if config.dashboard is on
  dashboard = express.createServer()
  dashboard.listen(config.dashboard_port)
  dashboard.use(express.static(__dirname + '/dashboard'));
  