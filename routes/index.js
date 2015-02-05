var express = require('express')
  , router = express.Router()
  , Shipment = require('models/Shipment')
  , User = require('models/User');


router.get('/', function (req, res, next) {
  if (req.user) {
    Shipment
      .find({user: req.user})
      .sort({updated: -1})
      .limit(10)
      .exec(function (err, lastShipments) {
        res.render('shipment/create', {lastShipments: lastShipments});
      });
  } else {
    res.render('shipment/create');
  }
});


router.post('/enquiry', function (req, res, next) {
  res.send();
});


router.get('/profile', function (req, res, next) {
  if (req.user) {
    User.findById(req.user._id).exec(function (err, profile) {
      res.render('profile', {profile: profile});
    });
  } else {
    res.redirect('/');
  }
});


router.post('/profile', function (req, res, next) {
  User.findByIdAndUpdate(req.user._id, {$set: req.body}).exec(function (err, user) {
    res.send({valid: true});
  });
});

module.exports = router;
