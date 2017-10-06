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
  var cityName = req.body.name.toLowerCase();
  findLocation (cityName , function (info) {
    //info is obj: longitude, latitude, weatherMark ..
    cities.find({name : cityName}).exec((err, citiesRow) => {
      if (!err && citiesRow.length !== 0){
        // add : (costMark , securityMark) to the info object then send it to callback
        info.costMark = citiesRow[0].cost ;
        info.securityMark = citiesRow[0].security  ;
        callback (info);
      } else {
        // if we didn't recieve data from table or we recieved empty array
        callback(info);
      }
    })
  })
}


//get data from weathers table : longitude, latitude, weatherMark  ..
function findLocation  (cityName , callback) { 
  weathers.find({name : cityName}).exec((err, weathersRow) => {
    //if we recieved empty array we will send only the name (else)
    if (!err && weathersRow.length !== 0) {
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

//var hotelImage = []; //canceled
//this function will get array of place_id for hotelsss for the city recieved by the request using it's long & lat..
var findPlaceId = function(req,res,callback){
  console.log('finding long , lat info .....');
  //best practice : pass the data to this function from the main server insted of calling findLocation again since data already have location inside it ..
  findLocation (req.body.name.toLowerCase() , function (location) {
  //get long & lat because the api require them to give IDs of hotels in that city 
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
    if (!places) {
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

    // to call the callback after all requests has been recieved ..
    //create counter and increase it each time we recieve a response 
    var counter = 0 ;

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
        //increase counter each time we recieve a response
        counter++;
        console.log('fetching hotels data : ', counter , '/', places.length);
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
          //we cancled image 
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
  //data in json.txt file is like : 
  /*
  cityName 5 6
  cityName 6 8
  cityName 9 .
  cityName . .
  cityName . .
  ...... etc
  */
  var citiesArr = fs.readFileSync('./database/json.txt').toString().split('\r\n');
  //after splitting it will look like : 
  //['cityName 5 6', 'cityName 5 6', ........etc]
  var array = []
  citiesArr.forEach((ele) => {
    var lineArr = ele.split(' ');
    //after splitting : ['cityName' , '5' , '6']
    var obj = {};
    obj["name"] = lineArr[0]
    obj["security"] = lineArr[1]
    obj["cost"] = lineArr[2]
    array.push(obj) //{name: '', security: 0 , cost: 0}
  });
  //array = [{}, {}, {}, ....... ]
  return array; 
}

//use of wikipedia api to get description about city
exports.findDescrption = function(req,res,callback){
  var city = req.body.name.toLowerCase();
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
    //if we have error or no description  
    if (error || !body[2][0]) {
      console.log('error : ', error.message);
      callback('');
      return ; //end the function 
    } 
    body = JSON.parse(body);
    discrption = body[2][0];  
    callback(discrption);
  });
}

// this will get an array of images from flickr api
exports.findImages = function(req,res,callback){
  var city = req.body.name.toLowerCase();
  var url =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1b1b44477ec0feacb05afc0de17f6e56&tags=tourism%2C"+city+"&tag_mode=all&privacy_filter=1&accuracy=11&safe_search=1&content_type=1&media=photos&per_page=5&format=json&nojsoncallback=1"
  var options = {
    url:url ,
    headers: {
      'User-Agent': 'request'
    },
    method : 'get'
  }
  request(url, function (error, response, body) {
    var parsed = JSON.parse(body);
    //if we didn't recieve images or got error ...
    if (error || !parsed.photos.photo) {
      console.log('error findImages : ', error);
      //to prevent the response from stopping .. 
      callback([]);
      return ;
    } else {
      var arrayLinks = [];
      var arrayOfImages = parsed.photos.photo;
      var len = arrayOfImages.length >= 5 ? 5 :  arrayOfImages.length 
      for (var i = 0; i < len; i++) {
        var link = "http://farm"+ arrayOfImages[i]["farm"] + ".staticflickr.com/"+arrayOfImages[i]["server"]+"/"+arrayOfImages[i]["id"] + "_" + arrayOfImages[i]["secret"] + ".jpg"
        arrayLinks.push(link)
      }
      callback(arrayLinks);
    }
  });
}

//using keys fron the file 'config.js' to switch the key for the api so the api will not block us : 
//we have 60 req allowed per min and 91 cities to get data for 
var count = 0;
exports.API = function (cityName, callback) {
  count++;
  var temp ;
  //keys is defined at the begining of the file as require('config.js')
  //it have two keys : powerPortAshar , hiba
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
    body = JSON.parse(body);
    //if the api blocked the request key we invoke the callback with undefined data to prevent inserting it to our table so it will not affect the (findCities) function ...
    if (error || !body.main || !body.coord) {
      console.log('error while updating weathers table : ', cityName);
      callback();
      return ;
    } else {
      temp = body.main.temp;  
      long = body.coord.lon;  
      lat = body.coord.lat; 
      callback(cityName , temp, long, lat );
    }
  });
}

//at post('/')
exports.findCities = function (req, res, CB) {
  
  var criteria = req.body;
  //the criteria is something like : { cost: '0', security: '0', wheater: '0' }
    
  //to get all cities from db => cities table ..
  cities.find().exec(function(error , citiesArr) {
    //citiesArr is like = [ {id: 0 , name: '' , security: 0, cost: 0 }, {...}, {...}, .....];
    weathers.find().exec((err, weathersArr) => {
      //weathersArr is like = [{id : 0 , name : '' , weather : 0}, {} , ... ]
    if (err) {
      console.log(err);
      CB([])
      return ;
    }
    //to be able to get the weather of any city by it's name => convert the arr of objects into object ..
      //weathersArr => [] => {name : '', weather: x , longitude : x ,latitude : x }
    //to be : 
      //weth => {'cityName' : x  , .... } => each city has weather ...
    var weth = {};
    weathersArr.forEach((item) => {
      weth[item.name] = parseInt(item.weather) * criteria.wheater ;
    })

    var results = [];
    //loop the citiesArr to count the mark of each city .. put all cities and thier marks inside results array by order
    citiesArr.forEach((cityRow) => {
        
      //check if the city has a weather mark or not .. if the api of weather didn't provide info about it , it will be ignored
        //coz sometimes the weather api have errors .. 
    if ( weth[cityRow.name] ) {
    
      //the mark depends on the criteria that the user provided 
      var acc = parseInt(cityRow.cost) * criteria.cost +
       parseInt(cityRow.security) * criteria.security +
        weth[cityRow.name]; 

        
      //create obj for each city (results will have cities like this one) :
      var city = {
        name : cityRow.name 
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
    //send only top 10 cities
    CB(results.slice(0,10));
    })
  })
}