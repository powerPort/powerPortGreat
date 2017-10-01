//define mongoose
var mongoose = require ('mongoose');
//small shortcut
var schema = mongoose.Schema ;
mongoose.Promise = require('bluebird');
var fs  = require("fs");


//add a table here 
var citiesSchema = new schema ({
    id : Number,
    name: String,
    cost: Number,
    security: Number,
    weather: Number
});
exports.cities = mongoose.model('cities', citiesSchema);

var allLines = fs.readFileSync('./database/json.txt').toString().split('\n');
// console.log(allLines)

if (allLines[0].split(' ').length === 3 || allLines[0].split(' ')[4] === '' ) {

	fs.writeFileSync('./database/json.txt',  (function(){
	    var newLine = '';
		allLines.forEach(function (line) { 
		nameCity = line.split(" ")[0]
			var options = {
			  url:"api.openweathermap.org/data/2.5/weather?q=" + nameCity,
				  headers: {
				    'User-Agent': 'request'
				  }
			}
		request(options, function (error, response, body) {

		});

		newLine += line + " "+ x+ " ***";
	    })
	    console.log(newLine)
	    return newLine ;
	})() , 'utf8')
}


// fs.writeFile('json.txt', 'Hello Node.js', (err) => {
//   if (err) throw err;
//   console.log('The file has been saved!');
// });

var connectionURL = 'mongodb://localhost/powerPort' ; // i think there have to be something with mlab , right?
mongoose.connect(connectionURL,  {
  useMongoClient: true
});

