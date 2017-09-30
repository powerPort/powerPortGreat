//this will have to deal with the database 
var db = require('../database/index.js');
const fs = require('fs');
const path = require('path');


exports.getMainPage = function(req, res, callback) {
  //do something to get the data => the main page ;
  var mainPage = fs.readFileSync(__dirname + '/../client/index.html').toString();
  //send it to the callback ;
  callback(mainPage);
}


exports.findCities = function (req, res, CB) {
	var criteria = req.body;
  //the criteria is something like : { cost: '0', security: '0', wheater: '0' }
	console.log('post req : findCities , criteria : ', criteria);
  //to get results from db ..
  cities.find().exec(function(citiesArr) {
    //do something to the citiesArr to count the mark of each city

  CB(citiesArr);
  })


  // //temp :
  // CB([{name : 'jrdan'},{name : 'jrdan'},{name : 'jrdan'}]);
}
