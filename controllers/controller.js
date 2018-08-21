
const dbController = require('../controllers/mlabController');

module.exports.loadHome = function(req, res){
    res.render('index', {title: 'Jason Pursey'});
};

module.exports.loadAbout = function(req, res){
    res.render('about', {});
};

module.exports.loadContact = function(req, res){
    res.render('contact', {});
};

module.exports.loadProjects = function(req, res){
    const tag = req.query.tag;
    var Project = dbController.Project;
    Project.find(function(err, projects){
        if(!err){
            res.render('projects', {activeTag: tag, projects: projects.sort(function(a,b){
                    return(a.lastUpdated > b.lastUpdated) ? -1 : 1;
                })});
        }else{
            res.sendStatus(404);
        }
    });
};

module.exports.loadJobs = function(req, res){
    res.render('jobs', {});
};

module.exports.loadJobsSimple = function(req, res){
    const tag = req.query.tag;
    var Job = dbController.Job;
    Job.find(function(err, jobs){
        if(!err){
            console.log(jobs);
            res.render('jobsSimple', {activeTag: tag, jobs: jobs.sort(function(a,b){
                return(a.end > b.end) ? -1 : 1;
                })});
        }else{
            res.sendStatus(404);
        }
    });
};

