//main server file
var express = require('express');

var app = express();

var port = process.env.PORT || 3000 ;

app.listen(port , function () {
  console.log('server is on at port : ' + port );
});

module.exports = app;