var mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    "title":String,
    "links" : [{
        "description": String,
        "url": String}],
    "imageUrls": [String],
    "tags": [String],
    "description": [String],
    "lastUpdated": Date
});

const jobSchema = mongoose.Schema({
    "nick": String,
    "organisation": String,
    "orgUrl": String,
    "role": String,
    "relevance": Number, // score out of 10
    "start": String, //"yyyy-mm-dd"
    "end": String,
    "comment": String,
    "related": [String]
});

mongoose.model('jobs', jobSchema);
mongoose.model('projects', projectSchema);