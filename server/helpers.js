var fs = require('fs');
var path = require('path');
var request = require('request');
var key = require('./config.js');

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

exports.API = function (cityName, callback) {
	var temp ;
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
                   callback(temp)
		}
	});
}
