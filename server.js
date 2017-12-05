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

date.setLocales('en', {
    A: ['AM', 'PM']
});

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
app.use(express.static(path.join(__dirname,'scripts')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());

app.get('/', function(request, response, next){
    response.sendFile(path.join(__dirname,"map.html"));
});

app.get('/contribute', function(request, response, next){
    response.sendFile(path.join(__dirname,"map-contribute.html"));
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

app.get('/render',function(request,response,next){
  response.writeHead(301,
  {Location: "https://api.mapbox.com/styles/v1/nyinyinyanlin/cjaqik220hd4j2so1sm0rx8wi/static/96.166,16.825,11.4,0.00,0.00/1280x720@2x?access_token=pk.eyJ1IjoibnlpbnlpbnlhbmxpbiIsImEiOiJjaXpucW8wenkwMnp0MndrN281eDZsdnE3In0.7z5t1MAr9PDHRhABhC9_9A"}
);
response.end();
});

app.get('/geojson', function(request, response, next){
  db.collection('dataset').find({}).toArray(function(err, results) {
    if(err){
      response.status(200).send("Error");
    } else {
      var jsondata = {
          "type": "FeatureCollection",
          "features": []
        };
      for(var i=0;i<results.length;i++){
        var feature = {
          "type": "Feature",
          "properties": {},
          "geometry": {
             "type": "Point",
             "coordinates": [
                Number(results[i].lon),Number(results[i].lat)
              ]
            }
        };
        jsondata.features[i] =  feature;
      }
      response.status(200).json(jsondata);
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
  console.log(request.body.username,request.body.password);
  db.collection('users').findOne({$and:[{"username":request.body.username},{"password":request.body.password}]},function(err,result){
    if(result){
      let now = new Date();
      delete request.body.password;
      request.body.time = date.format(now, 'DD/MM/YYYY HH:mm:ss A [GMT]Z');
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
