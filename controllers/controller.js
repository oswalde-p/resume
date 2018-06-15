
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
    res.render('projects', {});
};

module.exports.loadJobs = function(req, res){
    res.render('jobs', {});
};

