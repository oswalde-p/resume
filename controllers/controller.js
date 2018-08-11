
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
    res.render('projects', {tag: tag});
};

module.exports.loadJobs = function(req, res){
    res.render('jobs', {});
};

