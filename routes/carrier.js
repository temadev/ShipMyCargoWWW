var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , ObjectId = mongoose.Types.ObjectId
  , checkAuth = require('middleware/checkAuth')
  , Carrier = require('models/Carrier')
  , Person = require('models/Person')
  , User = require('models/User');


router.get('/', checkAuth.carrier, function (req, res, next) {
  Carrier.find({})
    .sort({name: 1})
    .populate('user', 'email username phone firstname lastname')
    .exec(function (err, companies) {
      res.render('carrier', {companies: companies});
    });
});

/* GET carrier by id. */
router.get('/:id', function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }

  Carrier.findById(id)
    .populate('user', 'email username phone firstname lastname')
    .exec(function (err, carrier) {
      if (err) throw err;
      if (!carrier) {
        next();
        return;
      }
      Person.find({carrier: carrier._id}, 'firstname lastname email phone designation').exec(function (err, persons) {
        res.render('carrier/view', {company: carrier, persons: persons});
      });
    });

});


router.get('/create', checkAuth.user, function (req, res, next) {
  Carrier.findOne({user: req.user._id}).exec(function (err, user) {
    if (!user)
      res.render('carrier/create');
    else
      res.redirect('/profile');
  });

});


router.post('/create', checkAuth.user, function (req, res, next) {

  var body = req.body
    , persons = req.body.person;

  body.user = req.user._id;
  body.person = [];

  var newCarrier = new Carrier(body);
  newCarrier.save(function (err, carrier) {
    async.each(persons, function (person, cb) {
      person.carrier = carrier;
      var newPerson = new Person(person);
      newPerson.save(function () {
        cb();
      });
    }, function () {
      res.send({valid: true, id: carrier._id});
    });
  });

});


router.post('/update', checkAuth.user, function (req, res, next) {
  try {
    var id = new ObjectId(req.body.id);
  } catch (e) {
    next();
    return;
  }

  var body = req.body
    , persons = req.body.person;

  //body.user = req.user._id;
  //body.person = [];

  Carrier.findByIdAndUpdate(id, {$set: body}).exec(function (err, carrier) {

    res.send({valid: true});
    //async.each(persons, function (person, cb) {
    //  person.carrier = carrier;
    //  var newPerson = new Person(person);
    //  newPerson.save(function () {
    //    cb();
    //  });
    //}, function () {
    //  res.send({valid: true, id: carrier._id});
    //});
  });

});


router.post('/remove', checkAuth.carrier, function (req, res, next) {
  try {
    var id = new ObjectId(req.body.id);
  } catch (e) {
    next();
    return;
  }

  Carrier.findByIdAndRemove(id).exec(function () {
    res.send({valid: true});
  });

});


module.exports = router;
