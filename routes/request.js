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


  if (req.body['delivery_points[]']) {
    var delivery_points = req.body['delivery_points[]'];
    if (typeof delivery_points === 'string') {
      delivery_points = [delivery_points];
    }
    query.delivery_point = { $in : delivery_points};
    result.delivery_points = delivery_points;
  }


  if (req.body['booking_points[]']) {
    var booking_points = req.body['booking_points[]'];
    if (typeof booking_points === 'string') {
      booking_points = [booking_points];
    }
    query.booking_point = { $in : booking_points};
    result.booking_points = booking_points;
  }


  if (req.body['weight']) {
    var weight = req.body['weight'];
    result.weight = weight;

    weight = weight.split('-');
    if (weight.length == 2) {
      query.total_weight = {$gte: parseInt(weight[0]), $lte: parseInt(weight[1])};
    } else {
      if (weight !== 'Any') {
        query.total_weight = {$gte: 5000};
      }
    }
  }

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


router.get('/ajax/:id', checkAuth.user, function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }
  Request.findById(id).populate('user').exec(function (err, request) {
    res.render('request/view_ajax', {request: request});
  });
});


router.get('/bid/:id', checkAuth.user, function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }
  Request.findById(id).exec(function (err, request) {
    res.render('request/bid_ajax', {request: request});
  });
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
