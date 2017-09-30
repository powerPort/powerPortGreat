//this will have to deal with the database 
var s = require('../database/index.js');
const fs = require('fs');
const path = require('path');


exports.getMainPage = function(req, res, callback) {
  //do something to get the data => the main page ;
  var mainPage = fs.readFileSync(__dirname + '/../client/index.html').toString();
  //test data :
  //var data = 'the main page';

  //send it to the callback ;
  callback(mainPage);
}


exports.findCities = function (req, res, CB) {
	var criteria = req.body;
	console.log('post req : findCities , criteria : ', criteria);
  //do something to get results from db ..
  /*cities.find().exec(function(citiesArr) {
    //do something to the arr
  CB(citiesArr);
  })*/


  //temp :
  CB([{name : 'jrdan'},{name : 'jrdan'},{name : 'jrdan'}])
}
