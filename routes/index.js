var express = require('express');
var controller = require('../controllers/controller');
var router = express.Router();

/* GET home page. */
router.get('/', controller.loadHome);
router.get('/about', controller.loadAbout);
router.get('/contact', controller.loadContact);
router.get('/jobs', controller.loadJobs);
router.get('/projects', controller.loadProjects);

module.exports = router;
