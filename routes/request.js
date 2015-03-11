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
        category: req.body.category,
        mode_of_dispatch: request.mode_of_dispatch,
        nature_of_movement: request.nature_of_movement,
        booking_point: request.booking_point,
        booking_pincode: request.booking_pincode,
        delivery_point: request.delivery_point,
        delivery_pincode: request.delivery_pincode,
        pickup_date: formatDate(request.pickup_date),
        total_value: parseInt(request.total_value),
        total_weight: parseInt(request.total_weight),
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


router.get('/', checkAuth.user, function (req, res, next) {
  var query = {status: true};
  var result = {};
  if (req.query.category) {
    query.category = req.query.category;
    result.category = req.query.category;
  }
  if (req.query.priceFrom && req.query.priceTo) {
    query.total_value = {$gte: req.query.priceFrom, $lte: req.query.priceTo};
    result.priceFrom = req.query.priceFrom;
    result.priceTo = req.query.priceTo;
  } else {
    if (req.query.priceFrom) {
      query.total_value = {$gte: req.query.priceFrom};
      result.priceFrom = req.query.priceFrom;
    }
    if (req.query.priceTo) {
      query.total_value = {$lte: req.query.priceTo};
      result.priceTo = req.query.priceTo;
    }
  }
  Request.find(query).exec(function (err, requests) {
    result.requests = requests;
    res.render('request', result);
  });
});

//router.get('/update', checkAuth.user, function (req, res, next) {
//  Request.find({}).exec(function (err, requests) {
//    async.each(requests, function (request, cb) {
//      Request.findById(request._id).exec(function (err, r) {
//        r.category = 1;
//        r.weight = parseInt(r.weight);
//        r.save();
//        cb();
//      });
//    }, function () {
//      res.send('ok')
//    });
//  });
//});


router.post('/ajax', checkAuth.user, function (req, res, next) {
  var query = {status: true};
  var result = {};
  if (req.body.category) {
    query.category = req.body.category;
    result.category = req.body.category;
  }
  if (req.body.priceFrom && req.body.priceTo) {
    query.total_value = {$gte: parseInt(req.body.priceFrom), $lte: parseInt(req.body.priceTo)};
    result.priceFrom = req.body.priceFrom;
    result.priceTo = req.body.priceTo;
  } else {
    if (req.body.priceFrom) {
      query.total_value = {$gte: parseInt(req.body.priceFrom)};
      result.priceFrom = req.body.priceFrom;
    }
    if (req.body.priceTo) {
      query.total_value = {$lte: parseInt(req.body.priceTo)};
      result.priceTo = req.body.priceTo;
    }
  }
  console.log(query);
  Request.find(query).exec(function (err, requests) {
    result.requests = requests;
    //console.log(result);
    res.render('request/index_ajax', result);
  });
});


//router.post('/json', checkAuth.user, function (req, res, next) {
//  var query = {status: true};
//  console.log(JSON.stringify(req.body));
//  if (req.body['search[value]'] !== '') {
//    query.regex = new RegExp(req.body['search[value]'], 'i');
//  }
//  Request
//    .find(query)
//    .skip(req.body.start).limit(req.body.length)
//    .exec(function (err, requests) {
//      console.log(req.body);
//      var allRequests = {
//        draw: req.body.draw,
//        recordsTotal: requests.length,
//        data: []
//      };
//      async.each(requests, function (request, cb) {
//        allRequests.data.push({
//          mode_of_dispatch: request.mode_of_dispatch,
//          nature_of_movement: request.nature_of_movement,
//          booking_point: request.booking_point + ' ' + request.booking_pincode,
//          delivery_point: request.delivery_point + ' ' + request.delivery_pincode,
//          pickup_date: request.pickup_date,
//          items: request.items.length,
//          total_weight: request.total_weight + ' kg',
//          total_value: '$' + request.total_value,
//          btn: '<a class="btn btn-primary btn-xs" href="/request/' + request._id + '">Place Bid</a>'
//        });
//        cb();
//      }, function () {
//        //console.log(allRequests);
//        res.json(allRequests);
//      })
//    });
//});


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
