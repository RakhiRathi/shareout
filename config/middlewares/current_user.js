var models  = require('../../models');

module.exports = function(req, res, next){
  res.locals.current_user = null
  req.current_user = null

  models.User
    .find({ where: { id: req.session.user_id } })
    .then(function(user) {
      if (user) {
        res.locals.current_user = user
        req.current_user = user
      }

      next()
    });
}
