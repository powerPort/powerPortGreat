//main server file
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./server/routes.js');
var app = express();

var port = process.env.PORT || 3000 ;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});



app.get('/', function (req, res) {
    routes.getMainPage(req, res, function (data) {
        res.send(data);
    })
})
app.post('/', function (req, res) {
    routes.findCities(req, res, function (data) {
    	console.log('inside the call back , data is : ', data)
        res.send(data);
    })
})

app.listen(port , function () {
  console.log('server is on at port : ' + port );
});

module.exports = app;




