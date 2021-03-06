const express = require('express');
const router = express.Router();

const pageController = require('../controllers/controller');
const dbController = require('../controllers/mlabController');

/* GET each page. */
router.get('/', pageController.loadHome);
router.get('/about', pageController.loadAbout);
router.get('/blog', (req, res) => res.render('blog'));
router.get('/contact', pageController.loadContact);
router.get('/jobs', pageController.loadJobs);
router.get('/jobs-simple', pageController.loadJobsSimple);

router.get('/projects', pageController.loadProjects);

router.post('/addJob', dbController.addJob);
router.get('/getAllJobs', dbController.getAllJobs);

router.post('/addProject', dbController.addProject);
router.get('/getProjects/', dbController.getProjectsWithTag);


module.exports = router;
