var mongoose = require('mongoose');

var db = "mongodb://admin:password123@ds018238.mlab.com:18238/resume";

mongoose.connect(db,function(err){
    if(!err){
        console.log("Connected to mongo");

    }else{
        console.log("Failed to connect to mongo");
    }
});

require('./schema.js');