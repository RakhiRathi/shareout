var express = require('express');
var router = express.Router();
var models  = require('../models');

// middleware specific to this router
router.use(function(req, res, next) {
  if (req.current_user){
    next();
  } else {
    req.session.alert_error = "Please sign in"
    res.redirect('/users/sign_in')
  }
});

// require('locus')

/* GET list of groups. */
router.get('/', function(req, res, next) {
  models.Group.findAll({ UserId: req.current_user.id }).then(function(groups){
    res.render('groups/index', {
      title: 'Groups - ShareOut',
      groups: groups
    })
  })
});

/* GET the group info. */
router.get('/show/:id', function(req, res, next) {
  models.Group.find({ where: { id: req.params.id } }).then(function(group) {
    group.getActivities({ order: 'createdAt desc' }).then(function(activities){
      res.render('groups/show', {
        title: 'Group - ShareOut',
        group: group,
        activities: activities
      })
    })
  })
});

/* GET new group. */
router.get('/new', function(req, res, next) {
  var group = models.Group.build({
    name: '',
    description: ''
  })

  res.render('groups/new', {
    title: 'New groups - ShareOut',
    group: group
  })
});

/* POST create group. */
router.post('/create', function(req, res, next) {
  var group = models.Group.build({
    name: req.body.name,
    description: req.body.description,
    UserId: req.current_user.id
  })

  group.save().then(function(){
    req.session.alert_success = 'Group successfully created.'
    res.redirect("/groups/show/" + group.id)
  }).catch(function(error){
    console.log(error)

    var alert_error = ""

    for (var i in error.errors){
      alert_error += error.errors[i].path + " : " + error.errors[i].message + "\n"
    }

    res.render('groups/new', {
      title: 'ShareOut',
      group: group,
      alert_error: alert_error
    });
  })
});

/* GET delete the group. */
router.get('/destroy/:id', function(req, res, next) {
  models.Group.find({ where: { id: req.params.id } }).then(function(group) {
    group.destroy().then(function(){
      req.session.alert_success = "Group was removed."
      res.redirect('/groups')
    })
  })
});

/* POST delete the group. */
router.post('/add_activity/:id', function(req, res, next) {
  models.Group.find({ where: { id: req.params.id } }).then(function(group) {

    var activity = models.Activity.build({
      title: req.body.title,
      cost: req.body.cost,
      GroupId: group.id
    })

    activity.save().then(function(e){
      res.send(JSON.stringify({ res: 'ok' }))
    }).catch(function(error){
      var alert_error = ""

      for (var i in error.errors){
        alert_error += error.errors[i].path + " : " + error.errors[i].message + "\n"
      }

      res.send({ errors: alert_error })
    })

  })
});

/* GET delete the activity. */
router.get('/destroy_activity/:id', function(req, res, next) {
  models.Activity.find({ where: { id: req.params.id } }).then(function(activity) {
    activity.destroy().then(function(){
      req.session.alert_success = "Activity was removed."
      res.redirect('/groups/show/' + activity.GroupId)
    })
  })
});


module.exports = router;
