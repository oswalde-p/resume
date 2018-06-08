var express = require('express');
var controller = require('../controllers/controller');
var router = express.Router();

/* GET home page. */
router.get('/', controller.loadHome);
router.get('/about', controller.loadAbout);
router.get('/contact', controller.loadContact);

module.exports = router;
