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
    weather: Number,
    longitude: Number,
    latitude: Number
});
var weathers = mongoose.model('weathers', weatherSchema);
exports.weathers = weathers;

/****************************************************************************************/

var lastUpdate = parseInt(fs.readFileSync('database/lastUpdate').toString());

//fill data inside cities table from json.txt file => only run once
(function () {
	cities.find().exec(function(err, data){
		//console.log('data : ', data.length )
		if (data.length === 0) {
			console.log("you shouldnt appear more than once for cities table on the same pc")
			var objectsCities = helper.fetcher();
			for (var i = 0; i < objectsCities.length; i++) {
				obj  = objectsCities[i]
				cities.insertMany([obj]);
			}
		}
    })
})();

//to update weather 
var updater = function (){
	var currentDate = (new Date()).getDay()
	cities.find().exec(function(err, data){
		if (lastUpdate < currentDate || (lastUpdate === 6 && currentDate === 0))  {
			//erase previouse content of the table : 
			weathers.remove({}, (err) => {
				if (err) {
                    console.log('error erasing')
                } else {
                    console.log('erased')
                    //change last update
                    fs.writeFileSync('database/lastUpdate',currentDate);
                    console.log("you shouldnt appear more than once for weathers table each day - for updating");
                    //fill weather data
                    var counter = 0;
                    for (var i = 0 ; i < data.length ; i++) {
                        helper.API(data[i].name , function (cityName, temp, long, Lat) {
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


/**************************************************************************************/
//mongodb://powerPort:powerPort1@ds013475.mlab.com:13475/powerportgreat
//mongodb://localhost/powerPort
var connectionURL = 'mongodb://powerPort:power1port@ds013475.mlab.com:13475/powerportgreat?authMechanism=SCRAM-SHA-1' ; 
mongoose.connect(connectionURL,  {
  useMongoClient: true
});

