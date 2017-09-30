var fs = require('fs');


//get data from the file and return it as obj {cityName:'x x x'}
exports.fetcher = function () {
	var citiesArr = fs.readFileSync(path.join(__dirname + '/../database/helpers.js')).split('\n');
	var obj = {};
	citiesArr.forEach((ele) => {
		var lineArr = ele.split(' ');
		obj[lineArr[0]] = lineArr.slice(0);
	});
	return obj;
}