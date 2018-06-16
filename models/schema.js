var mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    "name":String,
    "url": String,
    "imageUrl": String,
    "tags": [String],
    "description": [String],
    "updates": [{
        "date": Date,
        "content": [String],
        "imageUrls": [String]
    }]
});

const jobSchema = mongoose.Schema({
    "organisation": String,
    "orgUrl": String,
    "role": String,
    "relevance": Number, // score out of 10
    "start": Date,
    "end": Date,
    "comment": String
});

mongoose.model('jobs', jobSchema);
mongoose.model('projects', projectSchema);
console.log("Schema should be registered...");