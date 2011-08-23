root = this

# Node modules
express = require 'express'
server = express.createServer()
mongo = require 'mongodb'

#JS Libraries
_ = require '../vendor/underscore'

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

# Function to flush the cache to mongo
flushCache = () ->
  console.log cache
  db = new mongo.Db('test', new mongo.Server('localhost', 27017, {}), {})
    
  db.open (err, client) ->
    client.collection "users", (err, col) ->
      for prop of cache
        col.update( {user: prop}, {$push: { pageviews: cache[prop] }}, {upsert: true}, () -> )
      cache = {}
      return
    return
  return

# Server listening for beacon request. Returns 204 "No Content" status
server.get '/image.gif', (req, res) ->
  pushCache(req.query)
  res.send(204)

server.listen(3000)

# Flush cache every 2 seconds
setInterval(flushCache, 2000)