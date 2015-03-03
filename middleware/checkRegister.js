var User = require('models/User');

module.exports = function (req, res, next) {
  if (!req.user) {
    next();
    return;
  }

  User.findById(req.user).exec(function (err, user) {
    if (!user.status) {
      res.redirect('/auth/complete');
    } else {
      next();
    }
  });
};

