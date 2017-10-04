//this will have to deal with the database 
const fs = require('fs');
const path = require('path');
var db = require('../database/index.js'); 


const request = require('request');
var keys = require('./config.js');
var cities = require('../database/index.js').cities; 
var weathers = require('../database/index.js').weathers; 

console.log('cities :' , cities , 'weathers : ', weathers)


exports.findDBinfo = function (req, res , callback) {
  var cityName = req.body;
  findLocation (cityName , function (info) {     //info is obj : longitude , latitude , weatherMark 
    cities.find({name : cityName}).exec((err, citiesRow) => {
      if (!err){
        info.costMark = citiesRow.cost ,
        info.securityMark = citiesRow.security
        callback (info) // add : (costMark , securityMark) to the info object then send it to callback
      }
    })
  })
}

function findLocation  (cityName , callback) { 
  weathers.find({name : cityName}).exec((err, weathersRow) => {
    if (!err ) {
      var location = {
        name : weathersRow.name ,
        longitude : weathersRow.longitude , 
        latitude : weathersRow.latitude ,
        weatherMark : weathersRow.weather
      }
      callback(location); 
    }
  })
}

var hotelImage = [];
//this function will get array of place_id for hotelsss for the city recieved by the request using it's long & lat..
var findPlaceId = function(req,res,callback){
  findLocation (req.body , function (location) { //grt long & lat because the api require them to give hotels IDs in that place 
    var lat = location.latitude;
    var long = location.longitude;
    var key = "AIzaSyDVsRDaGBfX3gT77SXwpYlmpjvNqomCk2s";
    //var key = "AIzaSyCnJ1hNKvDpcD2mAsa4RA64-iIIBOq9Dgc"; //not enabled
    var palceId = [];
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=500&type=lodging&keyword=bus&key=" + key
    var options = {
      url:url ,
      headers: {
        'User-Agent': 'request'
      },
      method : 'get'
    }
    request(url, function (error, response, body) {
      if (error) {
        console.log('error : ', error.message);
      } else {
        body = JSON.parse(body);
        console.log(body)
        for (var i = 0; i < body["results"].length; i++) { //to keep only the hotels with rating (greater than 4) ;
          if (body["results"][i].rating > 3.9) {
            palceId.push(body["results"][i].place_id)
            //hotelImage.push(body[i].results.photos.photo_reference)
          }
        }
        console.log(palceId)
            callback(palceId);
      }
    });
  })
}

//using array of IDs from the (findPlaceId) function : we use it to get info about each hotel of them ..
// info to the callback is : [{ hotelName: '' ,rating: 0 , adress: '' ,reviews: ['', ...] } , .....]
exports.findHotel = function(req,res,callback){ 
  findPlaceId(req,res,function(places){
    var hotel = {};
    var hotels = [];
    var key = "AIzaSyDVsRDaGBfXgT77SXwpYlmpjvNqomCk2s";
    //var key = "AIzaSyCnJ1hNKvDpcD2mAsa4RA64-iIIBOq9Dgc" //not enabled
    var counter = 0 ; // to call the callback after all requests has been recieved ..

    for (var i = 0; i < palces.length; i++) {
      var url = " https://maps.googleapis.com/maps/api/place/details/json?placeid=" + palces[i] + "&key=AIzaSyDVsRDaGBfX3gT77SXwpYlmpjvNqomCk2s"  
      var options = {
        url:url ,
        headers: {
          'User-Agent': 'request'
        },
        method : 'get'
      }
      request(url, function (error, response, body) {
        counter++;
        if (error) {
          console.log('error : ', error.message);
        } else {
          var reviews = [];
          body = JSON.parse(body);
          var reviewsText = body["result"]["reviews"]
          hotel.hotelName = body["result"]["name"];
          hotel.address = body["result"]["formatted_address"]
          hotel.rating  = body["result"]["rating"]
          for (var i = 0; i < reviewsText.length; i++) {
            reviews.push(reviewsText[i].text)
          }
          hotel.reviews = reviews; 
          //hotel.image = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + hotelImage[i]+ " = "+ key;  
          hotels.push(hotel);
        }
        if(counter === palces.length){ // this means it's the last response ..
          callback(hotels)
        }
      });
    }
  })
}

//to get cities from the file to render in the db ..
exports.fetcher = function () {
  var citiesArr = fs.readFileSync('./database/json.txt').toString().split('\r\n');
  var array = []
  citiesArr.forEach((ele) => {
    var lineArr = ele.split(' ');
    var obj = {};
    obj["name"] = lineArr[0]
    obj["security"] = lineArr[1]
    obj["cost"] = lineArr[2]
    array.push(obj)
  });
  return array;
}

exports.findDescrption = function(req,res,callback){
  var city = req.body;
  var discrption;
  var url = " https://en.wikipedia.org/w/api.php?action=opensearch&search=" + city +"&limit=100&format=json"  
  var options = {
    url:url ,
    headers: {
      'User-Agent': 'request'
    },
    method : 'get'
  }
  request(url, function (error, response, body) {
    if (error) {
      console.log('error : ', error.message);
    } else {
      body = JSON.parse(body);
      discrption = body[2][0];  
      callback(discrption);
    }
  });
}

// this will get an array of images from flickr api
exports.findImages = function(req,res,callback){
  var city = req.body
  var url =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6d22fece4c9c47cb53d2ceb9e49da8de&tags=tourism%2C"+city+"&tag_mode=all&privacy_filter=1&accuracy=11&safe_search=1&content_type=1&media=photos&per_page=10&format=json&nojsoncallback=1"
  var options = {
    url:url ,
    headers: {
      'User-Agent': 'request'
    },
    method : 'get'
  }
  request(url, function (error, response, body) {
    if (error) {
      console.log('error hiba : ', error.message);
    } else {
      parsed = JSON.parse(body)
      var arrayLinks = [];
      console.log(parsed)
      arrayOfImages = parsed.photos.photo;
      for (var i = 0; i < 10; i++) {
        var link = "http://farm"+arrayOfImages[i]["farm"]+".staticflickr.com/"+arrayOfImages[i]["server"]+"/"+arrayOfImages[i]["id"]+"_"+arrayOfImages[i]["secret"]+".jpg/"
        arrayLinks.push(link)
      }
      callback(arrayLinks);
    }
  });
}

//to switch the key for the api so the api will not block us : we have 60 req allowed per min
var count = 0;
exports.API = function (cityName, callback) {
  count++;
  var temp ;
  var key = count > 55 ? keys['powerPortAshar'] : keys['hiba']
  var url = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + '&appid=' + key ;
  var options = {
    url:url ,
    headers: {
      'User-Agent': 'request'
    },
    method : 'get'
  }
  request(url, function (error, response, body) {
    if (error) {
      console.log('error : ', error.message);
    } else {
      body = JSON.parse(body);
      temp = body.main.temp;  
      long = body.coord.lon;  
      lat = body.coord.lat; 
      callback(cityName , temp, long, lat );
    }
  });
}
