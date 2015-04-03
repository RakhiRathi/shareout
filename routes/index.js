var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.current_user) {
    res.redirect('/groups/dashboard')
  } else {
    res.render('index', { title: 'ShareOut' });
  }
});

module.exports = router;
