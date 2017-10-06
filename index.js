//main server file
var express = require('express');
var bodyParser = require('body-parser');
var helpers = require('./server/helpers.js');
var app = express();
var cities = require('./database/index.js').cities; 
var weathers = require('./database/index.js').weathers; 


var port = process.env.PORT || 3000 ;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//'Access-Control-Allow-Origin', '*' => to allow all cross origin requests 
//by the way : localhost and 127.0.0.1 are dufferent (considered as cross origin so do the requests from heroku to localhost)
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
  //req.body : {name : 'cityName'}
  var info = {};
  //longitude : 0 , latitude : 0 , weatherMark : 0 , securityMark : 0 , costMark : 0
  helpers.findDBinfo(req,res,function(data){ 
    info = data ;
    console.log('fetching description .....')
    // description : ''
    helpers.findDescrption(req,res,function(data){ 
      info.description = data
      console.log('fetching images .....');
      // images : ['', ....]
      helpers.findImages(req,res,function(data){ 
        info.images = data
        console.log('fetching hotels .....');
        // hotels: [{ hotelName: '' ,rating: 0 , adress: '' ,reviews: ['', ...] } , .....]
        helpers.findHotel(req,res,function(data){ 
          info.hotels = data;
          console.log('info about : ', info.name , 'is found .. sending response')
          res.send(info)
        })
      })
    })
  })
})


app.post('/', function (req, res) {
    helpers.findCities(req, res, function (data) {
      console.log('inside the call back , data is : ', data);
        res.send(data);
    })
})


app.listen(port , function () {
  console.log('server is on at port : ' + port );
});

module.exports = app;




