//this will have to deal with the database 
const fs = require('fs');
const path = require('path');
var db = require('../database/index.js'); 
const request = require('request');
var keys = require('./config.js'); //for API function 
var cities = require('../database/index.js').cities; 
var weathers = require('../database/index.js').weathers; 

// console.log('cities :' , cities , 'weathers : ', weathers)


exports.findDBinfo = function (req, res , callback) {
  var cityName = req.body.name;
  // console.log('cityName ; ', cityName)
  findLocation (cityName , function (info) {  //info is obj: longitude, latitude, weatherMark 
    // console.log('info : ', info)
    cities.find({name : cityName}).exec((err, citiesRow) => {
      if (!err && citiesRow.length !== 0){
        info.costMark = citiesRow[0].cost ;
        info.securityMark = citiesRow[0].security  ;
        // console.log('info1 : ', info)
        callback (info) // add : (costMark , securityMark) to the info object then send it to callback
      } else {
          callback(info);
      }
    })
  })
}

function findLocation  (cityName , callback) { 
  weathers.find({name : cityName}).exec((err, weathersRow) => {
    if (!err && weathersRow.length !==0) {
      var location = {
        name : weathersRow[0].name ,
        longitude : weathersRow[0].longitude , 
        latitude : weathersRow[0].latitude ,
        weatherMark : weathersRow[0].weather
      }
      callback(location); 
    } else {
        callback({name : cityName})
    }
  })
}

var hotelImage = [];
//this function will get array of place_id for hotelsss for the city recieved by the request using it's long & lat..
var findPlaceId = function(req,res,callback){
    console.log('finding long , lat info .....')
  findLocation (req.body.name , function (location) { //get long & lat because the api require them to give hotels IDs in that place 
    if (!location.latitude) {
        //this means we don't have them in our db .. 
        callback(null);
        return ; //to stop the function
    }
    var lat = location.latitude;
    var long = location.longitude;
    // console.log(lat , long)
    //var keys = "AIzaSyDVsRDaGBfX3gT77SXwpYlmpjvNqomCk2s";
    var key = "AIzaSyCnJ1hNKvDpcD2mAsa4RA64-iIIBOq9Dgc"; 
    
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=10000&type=lodging&key=" + key
    var options = {
      url:url ,
      headers: {
        'User-Agent': 'request'
      },
      method : 'get'
    }
    console.log('fetching hotels IDs .....');
      var palceId = [];
    request(url, function (error, response, body) {
      if ( error || JSON.parse(body).results.LENGTH === 0 ) {
        console.log('error : ', error.message);
        callback(palceId);
          return;
      } else {
        body = JSON.parse(body);
          console.log('found : ', body["results"].length , 'hotels');
        //to get at most 5 hotels ....
        var allHotels = body["results"].length > 5 ? 5 : body["results"].length
        for (var i = 0; i < allHotels; i++) { 
            //to keep only the hotels with rating (greater than 4) ;
          if (body["results"][i].rating > 3.9) {
           // console.log('hotel : ', i )
            palceId.push(body["results"][i].place_id)
            //hotelImage.push(body[i].results.photos.photo_reference)
          }
        }
        // console.log('palceId : ', palceId)
            callback(palceId);
      }
    });
  })
}

//using array of IDs from the (findPlaceId) function : we use it to get info about each hotel of them ..
// info to the callback is : [{ hotelName: '' ,rating: 0 , adress: '' ,reviews: ['', ...] } , .....]
//to loop in the keys and use differnt one each time ..
var looper = 0;
exports.findHotel = function(req,res,callback){ 
  findPlaceId(req,res,function(places){
    if (places.length === 0) {
        callback([]);
        return ;
    }
    var hotels = [];
      //to make sure the api will not block us :P
      var localKeys = ['AIzaSyCp-4DJ5HfC_ioJ3WBLIbtd3b1fPGZt8Nw', 'AIzaSyArug6qDykksdZwC89lcfzOxQEQsq_utIk', 'AIzaSyDVsRDaGBfXgT77SXwpYlmpjvNqomCk2s' ];

      var key = localKeys[Math.floor(looper/localKeys.length)];
    //var key = "AIzaSyAJQ52-j9HQPxnZuen7Ewnj_9sUrJuAzW0"; //i think hiba
    //var key = "AIzaSyDVsRDaGBfX3gT77SXwpYlmpjvNqomCk2s";
    //var key = "AIzaSyBl1WAIRfUqukeHEL2eY-1FNe5HyD_Mmd0";
    //var key = "AIzaSyCT6SFgToGY3sL5XlskfjYm-jX10lO9r-g";

    var counter = 0 ; // to call the callback after all requests has been recieved ..

    for (var i = 0; i < places.length; i++) {
      var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + places[i] + "&key=" + key  
      var options = {
        url:url ,
        headers: {
          'User-Agent': 'request'
        },
        method : 'get'
      }
      
      request(url, function (error, response, body) {
        counter++;
        console.log('fetching hotels data : ', counter , '/', places.length)
        if (error) {
          console.log('error : ', error.message);
        } else {
          var hotel = {};
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
          
        if(counter === places.length){ // this means it's the last response ..
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
  var city = req.body.name;
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
  var city = req.body.name
  // console.log(city)
  var url =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1b1b44477ec0feacb05afc0de17f6e56&tags=tourism%2C"+city+"&tag_mode=all&privacy_filter=1&accuracy=11&safe_search=1&content_type=1&media=photos&per_page=5&format=json&nojsoncallback=1"
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
      // console.log('body after error hiba : ', body )
      parsed = JSON.parse(body)
      var arrayLinks = [];
      // console.log('parsed : ', parsed)
      arrayOfImages = parsed.photos.photo;
      var len = arrayOfImages.length >= 5 ? 5 :  arrayOfImages.length 
      for (var i = 0; i < len; i++) {
        var link = "http://farm"+ arrayOfImages[i]["farm"] + ".staticflickr.com/"+arrayOfImages[i]["server"]+"/"+arrayOfImages[i]["id"] + "_" + arrayOfImages[i]["secret"] + ".jpg"
        arrayLinks.push(link)
      }
      // console.log('arrayLinks : ', arrayLinks)
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

exports.findCities = function (req, res, CB) {
    
  var criteria = req.body;
  //the criteria is something like : { cost: '0', security: '0', wheater: '0' }
  // console.log('post req : findCities , criteria : ', criteria);
    
    
  //to get all cities from db => cities table ..
  cities.find().exec(function(error , citiesArr) {
    //citiesArr is like = [ {id:  , name: , security: , cost: , weather:  },{...},{...},.....];
    weathers.find().exec((err, weathersArr) => {
    if (err) {
      console.log(err);
      return ;
    }
      //to be able to get the weather of any city by it's name => convert the arr of objects into object ..
        //weathersArr => [] => {name : '', weather: x , longitude : x ,latitude : x }
        //to be : 
        //weth => {'cityName' : [ x, y, z] , .... } => each city has [ weather , longitude  ,latitude] in order ...
      var weth = {};
      weathersArr.forEach((item) => {
        weth[item.name] = [
          parseInt(item.weather) * criteria.wheater,
          parseInt(item.longitude), 
          parseInt(item.latitude)
          ]
      })

      var results = [];
    //loop the citiesArr to count the mark of each city .. put all cities and thier marks inside results array by order
    citiesArr.forEach((cityRow) => {
        
      //check if the city has a weather mark or not .. if the api of wweather didn't provide info about it , it will be ignored
        //coz sometimes the weather api have errors .. 
    if ( weth[cityRow.name] ) {
    
      //the mark depends on the criteria that the user provided 
      var acc = parseInt(cityRow.cost) * criteria.cost +
       parseInt(cityRow.security) * criteria.security +
        weth[cityRow.name][0]; 

        
      //create obj for each city (results will have cities like this one) :
      var city = {
        name : cityRow.name ,
        mark : acc 
      }

      //give the ele a place in the results arr -they have to be ordered :  
      var flag =  true ; //the city wasn't added ..

        for (var i = 0 ; i < results.length ; i++ ) {
          if (results[i].mark <  acc) { // i was working here
            results.splice(i , 0 , city );
            flag = false ; //the city was added to results arr 
            break; 
          }
        }

      //if flag is true : we didn't find any place for the city .. we will put it at the end 
      if (flag) {
        results.push(city);
      }
    } // close the if ( weth[cityRow.name] ) ...

 });
    //console.log(results.slice (0,10))
    //send only top 10 cities
    CB(results.slice(0,10));
    })
  })
}