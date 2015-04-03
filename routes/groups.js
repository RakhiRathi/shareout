var express = require('express');
var router = express.Router();
var models  = require('../models');

var sequelizePrettyErrors = function(error){
  var alert_error = ""
  for (var i in error.errors)
    alert_error += error.errors[i].path + " : " + error.errors[i].message + "\n"
  return alert_error
}

// middleware to check if the user is signed in
router.use(function(req, res, next) {
  if (req.current_user){
    next();
  } else {
    req.session.alert_error = "Please sign in"
    res.redirect('/users/sign_in')
  }
})

// middleware that loads Group by :id
router.all('/:action(show|destroy|add_activity|add_user|finish)?/:id', function(req, res, next) {
  models.Group
    .find({ where: { id: req.params.id } })
    .then(function(group) {
      req.resource = group
      next()
    })
})

/* GET list of groups. */
router.get('/dashboard', function(req, res, next) {
  req.current_user.getGroups({ include: [ models.User, models.UserShare, models.Activity ]})
    .then(function(groups){
      var totalExpenses = 0

      for (var i in groups){
        groups[i].totalCost = 0
        for (var us_i in groups[i].Activities){
          var us = groups[i].Activities[us_i]
          groups[i].totalCost += us.cost
        }
        groups[i].userCost = 0
        if (groups[i].UserShares.length > 0)
          groups[i].userCost = Math.ceil(groups[i].totalCost / groups[i].UserShares.length)
        totalExpenses += groups[i].userCost
      }

      res.render('groups/dashboard', {
        title: 'Groups - ShareOut',
        groups: groups,
        totalExpenses: totalExpenses
      })
    })
})

/* GET list of groups. */
router.get('/', function(req, res, next) {
  models.Group
    .findAll({ where: { UserId: req.current_user.id } })
    .then(function(groups){
      res.render('groups/index', {
        title: 'Groups - ShareOut',
        groups: groups,
      })
    })
})

/* GET the group info. */
router.get('/show/:id', function(req, res, next) {
  req.resource.getActivities({ order: 'createdAt desc' }).then(function(activities){
    var totalCost = 0
    for (var i in activities)
      totalCost += activities[i].cost

    req.resource.getUserShares({ order: 'createdAt desc', include: [ models.User ] })
      .then(function(user_shares){
        var genericShare = 0

        if (user_shares.length > 0)
          genericShare = Math.ceil(totalCost / user_shares.length)

        var view = 'groups/peek'

        if (req.resource.UserId == req.current_user.id)
          view = 'groups/show'

        res.render(view, {
          title: 'Group - ShareOut',
          group: req.resource,
          activities: activities,
          user_shares: user_shares,
          genericShare: genericShare,
          totalCost: totalCost
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
  req.resource.destroy().then(function(){
    req.session.alert_success = "Group was removed."
    res.redirect('/groups')
  })
});

/* POST add activity to the group. */
router.post('/add_activity/:id', function(req, res, next) {
  var activity = models.Activity.build({
    title: req.body.title,
    cost: req.body.cost,
    GroupId: req.resource.id
  })

  activity.save().then(function(e){
    res.send(JSON.stringify({ res: 'ok' }))
  }).catch(function(error){
    res.send({ errors: sequelizePrettyErrors(error) })
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

/* POST add user to the group. */
router.post('/add_user/:id', function(req, res, next) {
  models.User.find({ where: { id: req.body.userId } }).then(function(user){
    var userShare = models.UserShare.build({
      UserId: user.id,
      GroupId: req.resource.id
    })

    userShare.save().then(function(e){
      res.send(JSON.stringify({ res: 'ok' }))
    }).catch(function(error){
      res.send({ errors: sequelizePrettyErrors(error) })
    })
  }).catch(function(e){
    res.send({ errors: 'User not found' })
  })

});


/* GET finish the group. */
router.get('/finish/:id', function(req, res, next) {
  req.resource.finishedAt = new Date()
  req.resource.save()
    .then(function(){
      req.session.alert_success = "Group is finished."
      res.redirect('/groups/show/' + req.resource.id)
    })
})

module.exports = router;
