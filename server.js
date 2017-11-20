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

app.use(express.static('public'));
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
  db.collection('users').find({},function(err,result){
    if(result){
      delete result._id;
      response.status(200).json(result);
    }else{
      response.status(200).json({});
    };
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

app.listen(port);
