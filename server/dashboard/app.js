var app = require('express').createServer(),
  mongo = require('mongodb'),
  db;

db = new mongo.Db('test', new mongo.Server('localhost', 27017, {}), {});

app.listen(3333);

app.get('/dashboard', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/css/style.css', function (req, res) {
  res.sendfile(__dirname + '/css/style.css');
});

app.get('/data', function (req, res) {

  db.open(function(err, db) {
    db.collection('users', function(err, collection) {      
      collection.find({}, {limit:10}).toArray(function(err, docs) {
        
        res.contentType('application/json');
        //res.send( JSON.stringify(store[id]) );
        res.send({data: docs});
        
        db.close();
      });
    });
  });
  
});




