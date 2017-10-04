//main server file
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./server/routes.js');
var helpers = require('./server/helpers.js');
var app = express();
var cities = require('./database/index.js').cities; 
var weathers = require('./database/index.js').weathers; 


var port = process.env.PORT || 3000 ;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/client'));
app.use(function (req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});


//callback hell :)
app.post('/cities',function(req,res){
  var info = {};
  helpers.findDBinfo(req,res,function(data){ //longitude : 0 , latitude : 0 , weatherMark : 0 , securityMark : 0 , costMark : 0
    info = data ;
    helpers.findDescrption(req,res,function(data){  // description : ''
      info.description = data
      helpers.findImages(req,res,function(data){ // images : ['', ....]
        info.images = data
        helpers.findHotel(req,res,function(data){ // hotels: [{ hotelName: '' ,rating: 0 , adress: '' ,reviews: ['', ...] } , .....]
          info.hotels = data;
          res.send(info)
        })
      })
    })
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




