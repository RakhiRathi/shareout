// View Helpers

var moment = require('moment')

module.exports = function(req, res, next){
  res.locals.helper = {}

  res.locals.helper.moment = moment

  res.locals.formatDateTime = function(raw_time){
    return moment(raw_time).format('MMMM Do YYYY HH:mm')
  }

  res.locals.formatDate = function(raw_time){
    return moment(raw_time).format('MMMM Do YYYY')
  }

  next();
}
