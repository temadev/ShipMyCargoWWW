var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , ObjectId = mongoose.Types.ObjectId
  , checkAuth = require('middleware/checkAuth')
  , Shipment = require('models/Shipment')
  , Company = require('models/Company')
  , User = require('models/User');


router.get('/', checkAuth.carrier, function (req, res, next) {
  Shipment.find({})
    .sort({created: -1})
    .populate('user', 'email username phone firstname lastname')
    .exec(function (err, shipments) {
      //res.send(shipments);
      res.render('shipment', {shipments: shipments});
    });
});


router.get('/:id', function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }

  Shipment.findById(id)
    .populate('user', 'email username phone firstname lastname')
    .exec(function (err, shipment) {
      if (err) throw err;
      if (!shipment) {
        next();
        return;
      }

      var request = {};

      console.log(shipment);

      //if (shipment.vehicle) request.vehicle = shipment.vehicle;
      if (shipment.door_puckup) request.door_puckup = shipment.door_puckup;
      if (shipment.door_delivery) request.door_delivery = shipment.door_delivery;
      if (shipment.packaging_service) request.packaging_service = shipment.packaging_service;
      if (shipment.transit_insurance) request.transit_insurance = shipment.transit_insurance;

      Company
        .find(request)
        .populate('user', 'email username phone firstname lastname')
        .exec(function (err, companies) {
          res.render('shipment/view', {shipment: shipment, companies: companies});
        });

    });
});


router.get('/:id/edit', checkAuth.shipper, function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }

  Shipment.findById(id)
    .exec(function (err, shipment) {
      if (err) throw err;
      if (!shipment) {
        next();
        return;
      }

      Shipment
        .find({user: req.user, _id: {$ne: id}})
        .sort({updated: -1})
        .limit(10)
        .exec(function (err, lastShipments) {
          res.render('shipment/edit', {shipment: shipment, lastShipments: lastShipments});
        });

    });
});


router.get('/create', checkAuth.shipper, function (req, res, next) {
  Shipment
    .find({user: req.user})
    .sort({updated: -1})
    .limit(10)
    .exec(function (err, lastShipments) {
      res.render('shipment/create', {lastShipments: lastShipments});
    });
});


router.post('/', function (req, res, next) {
  if (req.user) {
    var body = req.body;
    body.user = req.user._id;
    if (body.id) {
      try {
        var id = new ObjectId(body.id);
      } catch (e) {
        next();
        return;
      }
      if (!body.vehicle) body.vehicle = false;
      if (!body.door_pickup) body.door_pickup = false;
      if (!body.door_delivery) body.door_delivery = false;
      if (!body.packaging_service) body.packaging_service = false;
      if (!body.transit_insurance) body.transit_insurance = false;
      if (!body.warehousing) body.size = '';
      body.updated = Date.now();
      Shipment.findByIdAndUpdate(id, {$set: body}).exec(function (err, shipment) {
        res.send({valid: true, id: shipment._id});
      });
    } else {
      var newShipment = new Shipment(body);
      newShipment.save(function (err, shipment) {
        res.send({valid: true, id: shipment._id});
      });
    }
  } else {
    res.send({valid: false, login: true});
  }
});

module.exports = router;
