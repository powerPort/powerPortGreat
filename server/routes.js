//this will have to deal with the database 
const fs = require('fs');
const path = require('path');
var db = require('../database/index.js');
var cities = require('../database/index.js').cities; 
var weathers = require('../database/index.js').weathers; 
console.log('routes , cities :' , cities , 'weathers : ', weathers)


exports.findCities = function (req, res, CB) {
    
  var criteria = req.body;
  //the criteria is something like : { cost: '0', security: '0', wheater: '0' }
  console.log('post req : findCities , criteria : ', criteria);
    
    
  //to get all cities from db => cities table ..
  cities.find().exec(function(error , citiesArr) {
    //citiesArr is like = [ {id:  , name: , security: , cost: , weather:  },{...},{...},.....];
    weathers.find().exec((err, weathersArr) => {
    if (err) {
      console.log(err);
    }
      //to be able to get the weather of any city by it's name => convert the arr of objects into object ..
        //weathersArr => [] => {name : '', weather: x , longitude : x ,latitude : x }
        //to be : 
        //weth => {'cityName' : [ x, y, z] , .... } => each city has [ weather , longitude  ,latitude] in order ...
      var weth = {};
      weathersArr.forEach((item) => {
        weth[item.name] = [
          parseInt(item.weather) * criteria.weather,
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
        longitude : weth[cityRow.name][1] ,
        latitude :  weth[cityRow.name][2],
        mark : acc , 
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
