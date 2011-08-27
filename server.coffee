###
Marzipan
###

# Require modules
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
  
  # Return early if data is empty
  return if _.isEmpty(data)
  
  # Pull user out of data
  user = data.user
  delete data.user
  
  # Add timestamp to data
  data.timestamp = Date.now() + ''
  
  # Add user to the cache
  if (!cache[user])
    cache[user] = []
  
  # Push pageview data onto user key
  cache[user].push(data)
  
  return

# Flush the cache to mongo
flushCache = () ->
  
  # Return early if the cache is empty
  return if _.isEmpty(cache)
  
  # Save and reset cache
  data = cache
  cache = {}
  
  # Print data to console
  console.log data
  
  # Save each pageview into database      
  db.open (err, client) ->
    client.collection "users", (err, col) ->
      for prop of data
        col.update( { user: prop }, { $pushAll: { pageviews: data[prop] } }, { upsert: true }, () -> )
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

# Flush cache every 5 seconds
setInterval(flushCache, 5000)

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
  