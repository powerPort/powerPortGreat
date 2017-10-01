var mongoose = require ('mongoose');
var schema = mongoose.Schema ; //small shortcut
mongoose.Promise = require('bluebird');
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
    weather: Number
});
var weather = mongoose.model('weather', weatherSchema);
exports.weather = weather;

/****************************************************************************************/

var lastUpdate = parseInt(fs.readFileSync('database/lastUpdate').toString());
console.log(typeof lastUpdate)
if (!lastUpdate) fs.writeFileSync('database/lastUpdate', (new Date()).getDay());
(function(){
	cities.find().exec(function(err, data){
		console.log('data : ')
		console.log(data.length)
		if (data.length === 0) {
			console.log("you shouldnt appear")
			var objectsCities = helper.fetcher();
			for (var i = 0; i < objectsCities.length; i++) {
				obj  = objectsCities[i]
				cities.insertMany([obj]);
			}
		}
		var currentDate = (new Date()).getDay()
		if (lastUpdate < currentDate || (lastUpdate === 7 && currentDate === 0))  {
			for (var i = 0; i < data.length; i++) {
				var tempRank = helper.API(data[i].name);
		        weather.insertMany([{name : data[i].name , weather : tempRank}]);
			}
		}
    })
})();

/**************************************************************************************/

var connectionURL = 'mongodb://127.0.0.1/powerPort' ; 
mongoose.connect(connectionURL,  {
  useMongoClient: true
});

