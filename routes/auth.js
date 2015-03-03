var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , User = require('models/User');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function (email, password, done) {
    if (email)
      email = email.toLowerCase();
    User.findOne({email: email}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Wrong User'});
      }
      if (!user.checkPassword(password)) {
        return done(null, false, {message: 'Wrong Password'});
      }
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.MAIN_DOMAIN + 'auth/facebook/callback'
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({facebook: profile.id}).exec(function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        done(null, user);
      } else {
        var newUser = new User({facebook: profile.id, firstname: profile.name.givenName, lastname: profile.name.familyName, status: false});
        newUser.save(function (err, user) {
          done(null, user);
        });
      }
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.MAIN_DOMAIN + 'auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({email: profile.emails[0].value}).exec(function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        done(null, user);
      } else {
        var newUser = new User({email: profile.emails[0].value, firstname: profile.name.givenName, lastname: profile.name.familyName, status: false});
        newUser.save(function (err, user) {
          done(null, user);
        });
      }
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));

router.get('/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));

router.post('/getUser', function (req, res, next) {
  if (req.body.loginEmail) {
    var email = req.body.loginEmail.toLowerCase();

    User.findOne({email: email}, function (err, user) {
      if (err) {
        res.send(err);
        return;
      }
      if (!user) {
        res.send({message: 'Wrong User'});
        return;
      }
      if (user) {
        res.send({valid: true});
      }
    });
  } else {
    res.send({valid: false});
  }
});

router.post('/checkRegister', function (req, res, next) {
  if (req.body.email) {
    var email = req.body.email.toLowerCase();

    User.findOne({email: email}, function (err, user) {
      if (err) {
        res.send(err);
        return;
      }
      if (!user) {
        res.send({valid: true});
        return;
      }
      if (user) {
        res.send({message: 'Already registered'});
      }
    });
  } else {
    res.send({valid: false});
  }
});

router.post('/login', function (req, res, next) {

  if (req.body.loginEmail) {
    req.body.loginEmail = req.body.loginEmail.toLowerCase();
  }

  var email = req.body.loginEmail
    , password = req.body.loginPassword;

  User.findOne({email: email}, function (err, user) {
    if (err) {
      res.send(err);
      return;
    }
    if (!user) {
      res.send({message: 'Wrong password'});
      return;
    }
    if (!user.password || !user.checkPassword(password)) {
      res.send({message: 'Wrong password'});
      return;
    }
    req.logIn(user, function (err) {
      if (err) {
        res.send({message: err});
        return;
      }
      res.send({valid: true});
    });
  });
});

router.post('/register', function (req, res, next) {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }

  var email = req.body.email
    , password = req.body.password
    , phone = req.body.phone
    , role = req.body.role || 'shipper'
    , firstname = capitaliseFirst(req.body.firstname)
    , lastname = capitaliseFirst(req.body.lastname);

  User.findOne({email: email}, function (err, user) {
    if (err) throw err;
    if (user) {
      res.send({message: 'Already registered'});
      return;
    }
    var newUser = new User({
      email: email,
      password: password,
      phone: phone,
      role: role,
      lastname: lastname,
      firstname: firstname
    });
    newUser.save(function (err, user) {
      if (err) throw err;

      req.logIn(user, function (err) {
        if (err) {
          res.send({message: err});
          return;
        }
        res.send({valid: true});
      });
    })
  });
});

router.post('/complete', function (req, res, next) {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }

  var id = req.body.id
    , email = req.body.email
    , password = req.body.password
    , phone = req.body.phone
    , role = req.body.role || 'shipper'
    , firstname = capitaliseFirst(req.body.firstname)
    , lastname = capitaliseFirst(req.body.lastname);

  User.findById(id, function (err, user) {
    if (err) throw err;

    user.email = email;
    user.password = password;
    user.phone = phone;
    user.role = role;
    user.firstname = firstname;
    user.lastname = lastname;
    user.status = true;

    user.save(function (err, user) {
      if (err) throw err;
      res.send({valid: true});
    })
  });
});

router.post('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/login', function (req, res, next) {
  if (!req.user) {
    //if (req.xhr) {
    //  res.render('auth/login_modal');
    //} else {
    //  res.render('auth/login');
    //}
    res.render('auth/login');
  } else {
    res.redirect('/profile');
  }
});

router.get('/register', function (req, res, next) {
  if (!req.user) {
    //if (req.xhr) {
    //  res.render('auth/login_modal');
    //} else {
    //  res.render('auth/register');
    //}
    res.render('auth/register');
  } else {
    res.redirect('/profile');
  }
});

router.get('/complete', function (req, res, next) {
  if (req.user) {
    res.render('auth/complete');
  } else {
    res.redirect('/auth/login');
  }
});

function capitaliseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = router;