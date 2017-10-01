var fs = require('fs');
var path = require('path');


//get data from the file and return it as obj {cityName:['x', 'x', 'x']}
exports.fetcher = function () {
	var citiesArr = fs.readFileSync(path.join(__dirname + '/../database/json.txt')).split('\n');
	var obj = {};
	citiesArr.forEach((ele) => {
		var lineArr = ele.split(' ');
		obj[lineArr[0]] = lineArr.slice(0);
	});
	return obj;
}