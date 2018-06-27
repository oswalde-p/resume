var mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    "name":String,
    "url": String,
    "imageUrl": String,
    "tags": [String],
    "description": [String],
    "updates": [{
        "date": String,
        "content": [String],
        "imageUrls": [String]
    }]
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