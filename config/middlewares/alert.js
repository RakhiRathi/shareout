module.exports = function(req, res, next){
  res.locals.alert_error = req.session.alert_error
  req.session.alert_error = null

  res.locals.alert_success = req.session.alert_success
  req.session.alert_success = null

  next();
}
