var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , ObjectId = mongoose.Types.ObjectId
  , checkAuth = require('middleware/checkAuth')
  , Company = require('models/Company')
  , Person = require('models/Person')
  , User = require('models/User');


router.get('/', checkAuth.carrier, function (req, res, next) {
  Company.find({})
    .sort({name: 1})
    .populate('user', 'email username phone firstname lastname')
    .exec(function (err, companies) {
      res.render('company', {companies: companies});
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
    .populate('user', 'email username phone firstname lastname')
    .exec(function (err, company) {
      if (err) throw err;
      if (!company) {
        next();
        return;
      }
      Person.find({company: company._id}, 'firstname lastname email phone designation').exec(function (err, persons) {
        res.render('company/view', {company: company, persons: persons});
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


router.post('/remove', checkAuth.carrier, function (req, res, next) {
  try {
    var id = new ObjectId(req.body.id);
  } catch (e) {
    next();
    return;
  }

  Company.findByIdAndRemove(id).exec(function () {
    res.send({valid: true});
  });

});

router.get('/populate', function (req, res, next) {
  var id = new ObjectId('54d90ff72f4922c811980b20');
  var companies = [];
  async.each(companies, function (company, cb) {
    var newCompany = new Company(company);
    newCompany.save(function (err, c) {
      var name1 = company.person_1.split(' ');
      var newPerson = new Person({
        company: c._id,
        firstname: name1[0],
        lastname: name1[1]?name1[1]:'' + name1[2]?' '+name1[2]:'',
        phone: company.person_1_phone,
        email: company.person_1_email,
        designation: "Promoter / CEO / HOS"
      });
      newPerson.save();
      var name2 = company.person_2.split(' ');
      var newPerson2 = new Person({
        company: c._id,
        firstname: name2[0],
        lastname: name2[1]?name2[1]:'' + name2[2]?' '+name2[2]:'',
        phone: company.person_2_phone,
        email: company.person_2_email,
        designation: company.person_2_designation
      });
      newPerson2.save();
      cb();
    });
  }, function () {
    Company.find({}).exec(function (err, companies) {
      res.send(companies);
    });
  });
});

module.exports = router;
