var express = require('express');
var router = express.Router();

/* GET list of activities. */
router.get('/', function(req, res, next) {
  res.send('lol')
});

/* GET the activity info. */
router.get('/show/:id', function(req, res, next) {
  console.log(req.params)
  res.send('lol ' + req.params.id)
});

/* GET new activity. */
router.get('/new', function(req, res, next) {
  console.log(req.params)
  res.send('lol new')
});

/* POST create activity. */
router.get('/create', function(req, res, next) {
  console.log(req.params)
  res.send('lol3 ')
});

module.exports = router;
