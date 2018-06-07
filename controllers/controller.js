
module.exports.loadHome = function(req, res){
    res.render('index', {title: 'Jason Pursey'});
};

module.exports.loadAbout = function(req, res){
    res.render('about', {});
};

