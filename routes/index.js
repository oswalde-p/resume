const express = require('express');
const router = express.Router();

const pageController = require('../controllers/controller');
const dbController = require('../controllers/mlabController');

/* GET each page. */
router.get('/', pageController.loadHome);
router.get('/about', pageController.loadAbout);
router.get('/contact', pageController.loadContact);
router.get('/jobs', pageController.loadJobs);
router.get('/projects', pageController.loadProjects);

router.post('/addJob', dbController.addJob);

module.exports = router;
