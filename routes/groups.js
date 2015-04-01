var express = require('express');
var router = express.Router();
var models  = require('../models');


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
    res.render('groups/show', {
      title: 'Group - ShareOut',
      group: group
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
      alert_error += error.errors[i].message + "\n"
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


module.exports = router;
