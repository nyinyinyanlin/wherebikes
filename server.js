var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var path = require("path");
var methodOverride = require('method-override');
var date = require('date-and-time');
var port = process.env.PORT;
var dbUrl = process.env.MONGODB_URI;
var db;

mongodb.MongoClient.connect(dbUrl, {poolSize: 5}, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  db = database;
  console.log("Database connection ready");
});

function processData(data){
  var finalData;
  var keys = Object.keys(data);
  for(var i=0;i<keys;i++){
    var key;
    switch(keys[i]){
      case "": break;
    }
  }
}

app.use(express.static(path.join(__dirname,'graphics')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());

app.get('/', function(request, response, next){
    response.sendFile(path.join(__dirname,"map.html"));
});

app.get('/login', function(request, response, next){
    response.sendFile(path.join(__dirname,"login.html"));
});

app.get('/dataset', function(request, response, next){
  db.collection('dataset').find({}).toArray(function(err, results) {
    if(err){
      response.status(200).send("Error");
    } else {
      for(var i=0;i<results.length;i++){
        delete results[i]._id;
      }
      response.status(200).json(results);
    }
  });
});

app.post('/check', function(request,response,next){
  db.collection('users').findOne({$and:[{"username":request.body.username},{"password":request.body.password}]},function(err,result){
    if(result){
      response.status(200).send("SUCCESS");
    }else{
      response.status(200).send("ERROR");
    }
  });
});

app.post('/insert', function(request,response,next){
  db.collection('users').findOne({$and:[{"username":request.body.username}]},function(err,result){
    if(result){
      if(request.body["name:my"]){
        request.body.name = request.body["name:my"];
      } else if(request.body["name:en"]){
        request.body.name = request.body["name:en"];
      }
      if(request.body.capacity){
        request.body.capacity = Number(request.body.capacity);
      }
      db.collection('dataset').insertOne(request.body);
      request.body.status = "SUCCESS";
      response.status(200).json(request.body);
    }else{
      response.status(200).json({status:"ERROR"});
    }
  });
});

app.listen(port);
