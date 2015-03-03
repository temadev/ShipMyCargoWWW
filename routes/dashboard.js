var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , checkAuth = require('middleware/checkAuth')
  , ObjectId = mongoose.Types.ObjectId
  , Shipment = require('models/Shipment')
  , Company = require('models/Company')
  , Request = require('models/Request')
  , User = require('models/User');


router.get('/', checkAuth.user, function (req, res, next) {
  res.redirect('/dashboard/current');
});

router.get('/:menu', checkAuth.user, function (req, res, next) {
  Request.find({user: req.user}).exec(function (err, requests) {
    res.render('dashboard', {requests: requests, menu: req.params.menu});
  });
});

module.exports = router;
