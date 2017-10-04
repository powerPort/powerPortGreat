//main server file
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./server/routes.js');
var helpers = require('./server/helpers')
var app = express();

//for google maps : allow frame to take info from google
//var xFrameOptions = require('x-frame-options')
//var middleware = xFrameOptions('https://maps.google.com/')


var port = process.env.PORT || 3000 ;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/client'));
app.use(function (req, res, next) {
   res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.google.com/maps?q=41,44&hl=es;z%3D14&amp;output=embed');
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});

app.post('/cities',function(req,res){
  var discAndImg = {};
  helpers.findDescrption(req,res,function(data){
      discAndImg.description = data
      helpers.findImages(req,res,function(data){
          discAndImg.images = data
          helpers.findHotel(req,res,function(data){
            discAndImg.hotels = data;
            console.log(data)
            res.send(discAndImg)
          })
      })
  })
})

app.get('/', function (req, res) {
    routes.getMainPage(req, res, function (data) {
        res.sendFile(data);
    })
})

app.post('/', function (req, res) {
    routes.findCities(req, res, function (data) {
      console.log('inside the call back , data is : ', data)
        res.send(data);
    })
})

//this func will recieve a city name and return it's info :
// app.post('/city', function (req, res) {
//     routes.cityInfo(req, res, function (data) {
//       console.log('inside the call back , findCityInfo of: ', req.body)
//       if (err) {
//       	res.send('no data');
//       } else {
//         res.send(data);
//       }
//     })
// })

app.listen(port , function () {
  console.log('server is on at port : ' + port );
});

module.exports = app;




