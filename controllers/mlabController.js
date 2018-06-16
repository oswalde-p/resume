var mongoose = require('mongoose');
var Job = mongoose.model('jobs');

module.exports.addJob = function(req, res){
    console.log(req.body);
    var job = new Job(req.body);
    job.save(function(err, job){
        if(!err){
            res.send(job);
            console.log("New job added successfully");
        }else{
            res.sendStatus(404);
        }
    });
};
