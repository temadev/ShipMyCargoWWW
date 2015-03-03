var User = require('models/User');

module.exports = function (req, res, next) {
  if (!req.user) {
    next();
    return;
  }

  User.findById(req.user).exec(function (err, user) {
    if (user) {
      res.locals.user = user;
      if (user.status) {
        user.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        user.updated = Date.now();
        user.save();
        next();
      } else {
        res.redirect('auth/complete')
      }
    }
  });
};