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
    //citiesArr is like = [ {id:  , name: , security: , cost: , weather:  },{},..];
    var results = [];
    //do something to the citiesArr to count the mark of each city
    citiesArr.forEach((cityRow) => {
      //the mark depends on the criteria that the user provided 
      var avg = parseInt(cityRow.cost) * criteria.cost +
       parseInt(cityRow.security) * criteria.security +
       parseInt(cityRow.wheater) * criteria.wheater ;

       //results will have cities like this one : 
      //create obj for each city :
      var city = {
        name : cityRow.name ,
        mark : avg
      }

      //give the ele a place in the results arr -they have to be ordered :  
      var flag =  true ; //the city wasn't added ..
      for (var i = 0 ; i < results.length ; i++ ) {
        if (results[i].mark <  avg) { // i was working here
          results.splice(i - 1 , 0 , city );
          flag = false ; //the city was added to results arr 
          break; 
        }
      }
      //if flag is true : we didn't find any place for the city .. we will put it at the end 
      if (flag) {
        results.push(city);
      }
    });
    CB(results);
  })
}
