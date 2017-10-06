var mongoose = require ('mongoose');
var schema = mongoose.Schema ; //small shortcut
mongoose.Promise = require('bluebird');  //keep this or you will get error , it have something to do with newer version etc.....
var fs  = require("fs");
var helper = require('../server/helpers')
/****************************************************************************************/
var citiesSchema = new schema ({
    id : Number,
    name: String,
    cost: Number,
    security: Number
});
var cities = mongoose.model('cities', citiesSchema);
exports.cities = cities;
/****************************************************************************************/
var weatherSchema = new schema ({
    id : Number,
    name: String,
    weather: Number,
    longitude: Number,
    latitude: Number
});
var weathers = mongoose.model('weathers', weatherSchema);
exports.weathers = weathers;

/****************************************************************/
//get the last day the weathers table was updated .. the return value is a number between 0-6 days of the week 
var lastUpdate = parseInt(fs.readFileSync('database/lastUpdate').toString());

//fill data inside cities table from json.txt file => only run once
(function () {
	cities.find().exec(function(err, data){
		//check if the cities table was filled .. this will run only once on each computer to fill the table : static data 
		if (data.length === 0) {
            //to get data from json.exe
			var objectsCities = helper.fetcher(); 
            // objectsCities is : [{name: '', security: 0 , cost: 0}, {}, {}, ....... ]
			for (var i = 0; i < objectsCities.length; i++) {
				obj  = objectsCities[i]
				cities.insertMany([obj]);
			}
		}
  })
})();

//to update weathers table
var updater = function (){
	var currentDate = (new Date()).getDay() 
  //currentDate will be a number 0-6 depending on the day of the week
	cities.find().exec(function(err, data){
    // the update should be once a day and the days will count from 0-6 so the previouse day of (0) is (6)
		if (lastUpdate < currentDate || (lastUpdate === 6 && currentDate === 0))  {
			//erase previouse content of the table : 
			weathers.remove({}, (err) => {
				if (err) {
          console.log('error erasing')
        } else {
          console.log('erased')
          //change last update to the current day of the week 0-6
          fs.writeFileSync('database/lastUpdate',currentDate);
          //fill weather data .. to make sure all data 91 were filled
          //just used in the console.log  
          var counter = 0;
          //loop through all cities in cities table and get thier names then get thier weather by (API) function then insert it to the weathers table 
          for (var i = 0 ; i < data.length ; i++) {
            //for each city : the API will call the callback with :cityName, temp, long, Lat .. in order 
            helper.API(data[i].name.toLowerCase() , function (cityName, temp, long, Lat) {
              //give a rank for the weather , the mark will be lower if the weather is far up or down from the average of (humans tempreture of comfort) which is 21 :
              //18 at winter .
              //24 at summer .
              if (!cityName) {
                //to queit if we didn't recieve data 
                return ;
              }
              var rank = 100 - Math.abs(((( temp ) - 294) / (2.73/2)));
              var tempRank =  rank < 0 ? 0 : rank ;
              var obj = {name : cityName , weather : tempRank.toFixed(2), longitude :  long, latitude : Lat} ;
              weathers.insertMany([obj]);
              console.log('added : ', counter++ , ' to weathers table .');
            });
          }
        }
			});
		}
	})
}
updater();
setInterval (updater, 24*60*60*1000);


/*************************************************************************/
//mongodb://<dbuser>:<dbpassword>@ds013475.mlab.com:13475/powerport
//mongodb://localhost/powerPort
var connectionURL = 'mongodb://powerport:powerport@ds013475.mlab.com:13475/powerport' ; 
mongoose.connect(connectionURL,  {
  authMechanism: 'ScramSHA1'
});
