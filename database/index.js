//define mongoose
var mongoose = require ('mongoose');
//small shortcut
var schema = mongoose.Schema ;
mongoose.Promise = require('bluebird');


//add a table here 
var someSchema = schema ({
    id : String
});
exports.tableName = mongoose.model('tableName', someSchema);




//add another table here 
var someOtherSchema = schema ({
    id : String
});
exports.OthertableName = mongoose.model('OthertableName', someOtherSchema);


var connectionURL = 'mongodb://localhost/powerPort' ; // i think there have to be something with mlab , right?
mongoose.connect(connectionURL,  {
  useMongoClient: true
});
