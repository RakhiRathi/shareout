var express = require('express');
var router = express.Router();

var crypto = require('crypto')

/* GET sign in form. */
router.get('/sign_in', function(req, res, next) {
  res.render('users/sign_in', { title: 'ShareOut' });
});

/* POST sign in user. */
router.post('/sign_in', function(req, res, next) {
  req.getConnection(function(err, connection) {
    if (err) return next(err);

    var email = req.body.email.trim().toLowerCase(),
        enc_password = crypto.createHash('sha1').update(req.body.password).digest('hex')

    connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, enc_password],
        function(err, results) {

      if (err) return next(err);

      if (results.length > 0){
        var user = results[0]
        res.cookie("user_id", user.id)
        res.cookie("alert_success", 'Successfully signed in.')
        res.redirect("/")
      } else {
        res.locals.alert_error = 'Invalid email or password'
        res.render('users/sign_in', { title: 'ShareOut' })
      }
    });

  });

});

/* GET sign out. */
router.get('/sign_out', function(req, res, next) {
  res.cookie("user_id", null)
  res.cookie("alert_success", 'Successfully signed out.')
  res.redirect("/")
});

/* GET sign up form. */
router.get('/sign_up', function(req, res, next) {
  var user = {}

  res.render('users/sign_up', { title: 'ShareOut', user: user });
});

/* POST sign up user. */
router.post('/sign_up', function(req, res, next) {
  req.getConnection(function(err, connection) {
    if (err) return next(err);

    var enc_password = crypto.createHash('sha1').update(req.body.password).digest('hex')

    var user = {
      email: req.body.email.trim().toLowerCase(),
      name: req.body.name,
      password: enc_password
    }

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [user.email],
        function(err, results) {

      if (err) return next(err)

      if (results.length > 0){
        res.render('users/sign_up', { title: 'ShareOut', user: user, alert_error: "Email is already taken." });
      } else {

        connection.query('INSERT INTO users SET ?', user, function(err, result){
          if (err) return next(err)

          console.log('insert id ' + result.insertId)

          res.cookie("alert_success", 'You successfully signed up. Please sign in now.')
          res.redirect("/users/sign_in")
        })

      }
    });

  });

});


module.exports = router;
