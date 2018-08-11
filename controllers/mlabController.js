var mongoose = require('mongoose');
var Job = mongoose.model('jobs');
var Project = mongoose.model('projects');
module.exports.Project = Project;

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

module.exports.getAllJobs = function(req, res){
    Job.find(function(err, jobs){
        if (!err){
            res.send(jobs);
        }else{
            res.sendStatus(404);
        }
    });
};


module.exports.addProject = function(req, res){
    var project = new Project(req.body);
    project.save(function(err, project){
        if(!err){
            res.send(project);
            console.log("New job added successfully");
        }else{
            res.sendStatus(404);
        }
    });
};

module.exports.getAllProjects = function(){
    Project.find(function(err, projects){
        if(!err){
            return(projects);
        }else{
            return null;
        }
    });
};

module.exports.getProjectsWithTag = function(req, res){
  const searchTag = req.query.tag;
    console.log(searchTag);
  //not sure if this will work
  Project.find({tag:searchTag}, function(err, projects){
      if(!err){
          res.send(projects);
      }else{
          res.sendStatus(404);
      }

  })
};
