var express = require('express');
var router = express.Router();

/* GET sign in form. */
router.get('/sign_in', function(req, res, next) {
  res.render('users/sign_in', { title: 'ShareOut' });
});

/* POST sign in user. */
router.post('/sign_in', function(req, res, next) {
  req.getConnection(function(err, connection) {
    if (err) return next(err);

    var email = req.body.email;
    var password = req.body.password;

    connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        function(err, results) {

      if (err) return next(err);

      if (results.length > 0){
        var user = results[0]
        res.cookie("user_id", user.id)
        res.redirect("/")
      } else {
        res.send('user not found with given email and password.');
      }
    });

  });

});

/* GET sign out. */
router.get('/sign_out', function(req, res, next) {
  res.cookie("user_id", null)
  res.redirect("/")
});

/* GET sign up form. */
router.get('/sign_up', function(req, res, next) {
  res.render('users/sign_up', { title: 'ShareOut' });
});


module.exports = router;
