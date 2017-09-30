//this will have to deal with the database 
var cities = require('../database/index.js');


exports.getMainPage = function(req, res, callback) {
  //do something to get the data => the main page ;
  var mainPage = fs.readFileSync('../client/index.html').toString();

  //test data :
  //var data = 'the main page';

  //send it to the callback ;
  callback(data);
}


exports.findCities = function (req, res, CB) {
	var criteria = req.body;
	console.log('post req : findCities , criteria : ', criteria);
  //do something to get results page ..

  CB('some data to be sent to the response');
}