var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , ObjectId = mongoose.Types.ObjectId
  , checkAuth = require('middleware/checkAuth')
  , Shipment = require('models/Shipment')
  , User = require('models/User');

/* GET shipments listing. */
router.get('/', function (req, res, next) {
  Shipment.find({}).exec(function (err, shipments) {
    res.send(shipments);
  });
});

/* GET shipment by id. */
router.get('/:id', function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }

  Shipment.findById(id)
    .populate('user', 'email username firstname lastname')
    .exec(function (err, shipment) {
    if (err) throw err;
    if (!shipment) {
      next();
      return;
    }
    res.send(shipment);
  });
});


router.get('/create', checkAuth.shipper, function (req, res, next) {
  res.render('shipment/create');
});


router.post('/create', checkAuth.shipper, function (req, res, next) {
  var body = req.body;
  body.user = req.user._id;
  var newShipment = new Shipment(body);
  newShipment.save(function (err, shipment) {
    res.send({valid: true, id: shipment._id});
  });
});

module.exports = router;
