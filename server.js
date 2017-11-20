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

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());

app.get('/', function(request, response, next){
    response.sendFile(path.join(__dirname,"map.html"));
});

app.get('/login', function(request, response, next){
    response.sendFile(path.join(__dirname,"login.html");
});

app.listen(port);
