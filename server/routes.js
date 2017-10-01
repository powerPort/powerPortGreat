//this will have to deal with the database 
var db = require('../database/index.js');
const fs = require('fs');
const path = require('path');
var cities = require('../database/index.js').cities; 
var weathers = require('../database/index.js').weathers; 


exports.getMainPage = function(req, res, callback) {
  //do something to get the data => the main page ;
  //var mainPage = fs.readFileSync(__dirname + '/../client/index.html').toString();
  //send it to the callback ;
  //callback(mainPage);
  callback(__dirname + '/../client/index.html'); //????
}


exports.findCities = function (req, res, CB) {
  var criteria = req.body;
  //the criteria is something like : { cost: '0', security: '0', wheater: '0' }
  console.log('post req : findCities , criteria : ', criteria);
  //to get results from db ..
  cities.find().exec(function(error , citiesArr) {
    //citiesArr is like = [ {id:  , name: , security: , cost: , weather:  },{},..];
    weathers.find().exec((err, weathersArr) => {
    if (err) {
      console.log(err)
    }
    console.log('weath arr from find()  : ', weathersArr)

      var weth = {};
      weathersArr.forEach((item) => {
        weth[item.name] = parseInt(item.weather) * criteria.wheater
      })

      var results = [];
    //do something to the citiesArr to count the mark of each city
    citiesArr.forEach((cityRow) => {
      //the mark depends on the criteria that the user provided 

      var acc = parseInt(cityRow.cost) * criteria.cost +
       parseInt(cityRow.security) * criteria.security +
        weth[cityRow.name]; 
      //results will have cities like this one : 
      //create obj for each city :
      var city = {
        name : cityRow.name ,
        mark : acc , 
        votes : 0
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

      console.log(city)
    });
    console.log(results)

    CB(results.slice(0,10));
    })
  })
}
