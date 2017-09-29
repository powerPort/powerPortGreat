//define mongoose
var mongoose = require ('mongoose');
//small shortcut
var schema = mongoose.schema ;



//add a table here 
var someSchema = schema ({
    id : STRING
});
exports.tableName = mongoose.model('tableName', someSchema);




//add another table here 
var someOtherSchema = schema ({
    id : STRING
});
exports.OthertableName = mongoose.model('OthertableName', someOtherSchema);
