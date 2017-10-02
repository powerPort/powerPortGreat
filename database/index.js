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
var weathers = mongoose.model('weathers', weatherSchema);
exports.weathers = weathers;

/****************************************************************************************/

var lastUpdate = parseInt(fs.readFileSync('database/lastUpdate').toString());
if (!lastUpdate) fs.writeFileSync('database/lastUpdate', (new Date()).getDay());
setInterval(() => {
	cities.find().exec(function(err, data){
		//console.log('data : ', data.length )
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
			//erase previouse content of the table : 
			weathers.drop();
			fs.writeFileSync('database/lastUpdate',currentDate);
			console.log("you shouldnt appear");
			for (var i = 0 ; i < data.length ; i++) {
				helper.API(data[i].name , function (cityName, temp) {
					var rank = 100 - Math.abs(((( temp ) - 294) / (2.73/2)));
					var tempRank =  rank < 0 ? 0 : rank ;
					var obj = {name : cityName , weather : tempRank.toFixed(2)} ;
					console.log('inside API , adding : ', obj);
 					weathers.insertMany([obj]);
				});
			}
		}
        })
}, 24*60*60*1000);


/**************************************************************************************/

var connectionURL = 'mongodb://newport:newport@ds159344.mlab.com:59344/power-port' ; 
mongoose.connect(connectionURL,  {
  useMongoClient: true
});

