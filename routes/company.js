var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , ObjectId = mongoose.Types.ObjectId
  , checkAuth = require('middleware/checkAuth')
  , Company = require('models/Company')
  , Person = require('models/Person')
  , User = require('models/User');

/* GET companys listing. */
router.get('/', function (req, res, next) {
  Company.find({}).exec(function (err, companys) {
    res.send(companys);
  });
});

/* GET company by id. */
router.get('/:id', function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }

  Company.findById(id)
    .populate('user', 'email username firstname lastname')
    .exec(function (err, company) {
      if (err) throw err;
      if (!company) {
        next();
        return;
      }
      Person.find({company: company._id}, 'firstname lastname email phone designation').exec(function (err, persons) {
        res.send({company: company, persons: persons});
      });
    });

});


router.get('/create', checkAuth.carrier, function (req, res, next) {
  res.render('company/create');
});


router.post('/create', checkAuth.carrier, function (req, res, next) {

  var body = req.body
    , persons = req.body.person;

  body.user = req.user._id;
  body.person = [];

  var newCompany = new Company(body);
  newCompany.save(function (err, company) {
    async.each(persons, function (person, cb) {
      person.company = company;
      var newPerson = new Person(person);
      newPerson.save(function () {
        cb();
      });
    }, function () {
      res.send({valid: true, id: company._id});
    });
  });

});

module.exports = router;
