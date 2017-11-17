var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var path = require("path");
var methodOverride = require('method-override');
var date = require('date-and-time');
var port = process.env.PORT || 8080;
//var dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/monetarydb';
//var db;

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());

app.get('/', function(request, response, next){
    response.sendFile(path.join(__dirname,"map.html"));
});

app.get('/cert',function(request, response, next){
    response.sendFile(path.join(__dirname,"opensslcert/server.key"));
})

var secureServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname,"opensslcert/server.key")),
    cert: fs.readFileSync(path.join(__dirname,"opensslcert/server.crt")),
    ca: fs.readFileSync(path.join(__dirname,"opensslcert/ca.crt")),
    requestCert: true,
    rejectUnauthorized: false
}, app).listen('8080', function() {
    console.log("Secure Express server listening on port 8080");
});
