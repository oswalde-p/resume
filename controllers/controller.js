
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
    console.log(tag);
    var Project = dbController.Project;
    Project.find(function(err, projects){
        if(!err){
            res.render('projects', {activeTag: tag, projects: projects});
        }else{
            res.sendStatus(404);
        }
    });
};

module.exports.loadJobs = function(req, res){
    res.render('jobs', {});
};

