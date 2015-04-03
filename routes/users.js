var express = require('express');
var router = express.Router();

var crypto = require('crypto')

var models  = require('../models');

var generatePasswordHash = function(str){
  return crypto.createHash('sha1').update(str).digest('hex')
}

/* GET sign in form. */
router.get('/sign_in', function(req, res, next) {
  res.render('users/sign_in', { title: 'ShareOut', email: '' });
});

/* POST sign in user. */
router.post('/sign_in', function(req, res, next) {
  var email = req.body.email.trim().toLowerCase(),
      enc_password = generatePasswordHash(req.body.password)

  models.User
    .find({ where: { email: email, password: enc_password } })
    .then(function(user) {
      if (!user) {
        res.locals.alert_error = 'Invalid email or password'
        res.render('users/sign_in', { title: 'ShareOut', email: email })
      } else {
        req.session.user_id = user.id
        req.session.alert_success = 'Successfully signed in.'
        res.redirect("/")
      }
    });
});

/* GET sign out. */
router.get('/sign_out', function(req, res, next) {
  req.session.user_id = null
  req.session.alert_success = 'Successfully signed out.'
  res.redirect("/")
});

/* GET sign up form. */
router.get('/sign_up', function(req, res, next) {
  var user = models.User.build({
    email: '',
    name: ''
  })

  res.render('users/sign_up', { title: 'ShareOut', user: user });
});

/* POST sign up user. */
router.post('/sign_up', function(req, res, next) {
  var user = models.User.build({
    email: req.body.email.trim().toLowerCase(),
    name: req.body.name,
    password: generatePasswordHash(req.body.password)
  })

  if (req.body.password.length < 6){
    res.render('users/sign_up', {
      title: 'ShareOut',
      user: user,
      alert_error: "Short passwords are easy to guess. Try one with at least 6 characters."
    });
    return
  }

  user.save().then(function(){
    req.session.alert_success = 'You successfully signed up. Please sign in now.'
    res.redirect("/users/sign_in")
  }).catch(function(error){
    console.log(error)

    var alert_error = ""

    for (var i in error.errors){
      alert_error += error.errors[i].path + " : " + error.errors[i].message + "\n"
    }

    res.render('users/sign_up', {
      title: 'ShareOut',
      user: user,
      alert_error: alert_error
    });
  })

});

/* GET search users. */
router.get('/search', function(req, res, next) {
  models.User
    .findAll({ limit: 10, where: { $or: [{ email: { like: req.query.q+'%' }}, { name: { like: '%'+req.query.q+'%' }}]}})
    .then(function(users_raw){
      var users = users_raw.map(function(u){ return u.toSearchResult()})
      res.send({ users: users })
    })
})


module.exports = router;
