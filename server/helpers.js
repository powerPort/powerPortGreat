var fs = require('fs');
var path = require('path');
var request = require('request');
var keys = require('./config.js');

exports.cityInfo = function (cityName , callback) {
callback(cityPic());
}

// var cityPic = function (cityName) {
// 	var url = 'https://api.teleport.org/api/urban_areas/slug:' + cityName + '/'
//         request(url, function (error, response, body) {
// 		if (error) {
// 		  console.log('error : ', error.message);
// 		  callback(error)
// 		} else {
// 		  body = JSON.parse(body);
// 		  var img = body.photos.image.web
// 		  console.log(img)
// 		  var obj = {
// 		  	name : cityName ,
// 		  	img : img 
// 		  }
//                   callback(null , obj)
// 		}
//         });
// }

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
	console.log(req.body)
  var city = req.body.name;
  	console.log("city from post : " ,city)
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

exports.findImages = function(req,res,callback){
	var long = req.body
	var lat = req.body
	console.log("long and lat from post : ",long,lat)
	
	var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + "14228e53e54ac43631ad367e18a534f7" + "&tags=tourism&privacy_filter=1&accuracy=11&safe_search=1&content_type=1&media=photos&lat="+lat +"&lon="+ long +"&per_page=10&format=json&nojsoncallback=1&auth_token=72157687403979384-0c46ae5e0ec4702a&api_sig=9b6e96ef6c1716274952c768b1d685be"
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
		  arrayImages = []
          callback(arrayImages);
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
