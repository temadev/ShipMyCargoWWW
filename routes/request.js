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

router.post('/', function (req, res, next) {
  if (req.user) {
    var request = req.body
      , items = []
      , newRequest = new Request({
        user: req.user,
        mode_of_dispatch: request.mode_of_dispatch,
        nature_of_movement: request.nature_of_movement,
        booking_point: request.booking_point,
        booking_pincode: request.booking_pincode,
        delivery_point: request.delivery_point,
        delivery_pincode: request.delivery_pincode,
        pickup_date: formatDate(request.pickup_date),
        total_value: request.total_value,
        total_weight: request.total_weight,
        permit: (typeof request.permit !== 'undefined'),
        vehicle: (typeof request.vehicle !== 'undefined'),
        door_pickup: (typeof request.door_pickup !== 'undefined'),
        packaging_service: (typeof request.packaging_service !== 'undefined'),
        transit_insurance: (typeof request.transit_insurance !== 'undefined'),
        door_delivery: (typeof request.door_delivery !== 'undefined')
      });

    async.each(request.items, function (item, cb) {
      if (item !== null && item.unit) items.push(item);
      cb();
    }, function () {
      newRequest.items = items;
      newRequest.save(function (err, item) {
        res.send({valid: true, id: item._id});
      });
    });
  } else {
    res.send({valid: false, login: true});
  }
});

router.get('/:id', checkAuth.user, function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }
  Request.findById(id).exec(function (err, request) {
    res.render('request/view', {request: request});
    if (!request.status) {
      request.status = true;
      request.save();
    }
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
