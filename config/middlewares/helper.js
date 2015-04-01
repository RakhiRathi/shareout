// View Helpers

var moment = require('moment')

module.exports = function(req, res, next){
  res.locals.helper = {}

  res.locals.helper.moment = moment

  next();
}
