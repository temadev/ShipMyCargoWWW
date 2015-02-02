module.exports = {
  shipper: function (req, res, next) {
    if (!req.isAuthenticated()) {
      req.session.goingTo = req.url;
      res.redirect('/auth/login');
      return;
    }
    if (req.user && (req.user.role === 'shipper' || req.user.role === 'admin')) {
      next();
    } else {
      res.redirect('/');
    }
  },
  carrier: function (req, res, next) {
    if (!req.isAuthenticated()) {
      req.session.goingTo = req.url;
      res.redirect('/auth/login');
      return;
    }
    if (req.user && (req.user.role === 'carrier' || req.user.role === 'admin')) {
      next();
    } else {
      res.redirect('/');
    }
  },
  admin: function (req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.redirect('/');
    }
  }
};