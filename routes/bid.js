var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , checkAuth = require('middleware/checkAuth')
  , ObjectId = mongoose.Types.ObjectId
  , Shipment = require('models/Shipment')
  , Company = require('models/Company')
  , Bid = require('models/Bid')
  , User = require('models/User');


router.post('/update', function (req, res, next) {

  var newBid = new Bid({
    user: req.user,
    request: req.body.request,
    freight: req.body.freight,
    transit_time: req.body.transit_time
  });

  if (req.body.validity_hours)
    newBid.validity_hours = req.body.validity_hours;
  if (req.body.insurance)
    newBid.insurance = true;

  newBid.save(function (err, bid) {
    res.send({valid: true, id: req.body.request})
  });

});


router.post('/num_bids', function (req, res, next) {

  Bid.count({request: req.body.id}).exec(function (err, num) {
    if (num) {
      console.log({valid: true, num: num, id: req.body.id});
      res.send({valid: true, num: num, id: req.body.id});
    }
    else
      res.send();
  });

});


router.post('/lowest_bid', function (req, res, next) {

  Bid.find({request: req.body.id}).sort({freight: 1}).exec(function (err, bid) {
    if (bid && bid.length) {
      console.log({valid: true, bid: 'Freight — ' + bid[0].freight + '<br>TT — ' + bid[0].transit_time, id: req.body.id });
      res.send({valid: true, bid: 'Freight — ' + bid[0].freight + '<br>TT — ' + bid[0].transit_time, id: req.body.id });
    }
    else
      res.send();
  });

});


module.exports = router;

function formatDate(date) {
  var d = new Date();
  if (date !== '') {
    d.setTime(Date.parse(date));
    date = d;
  }
  return date;
}
