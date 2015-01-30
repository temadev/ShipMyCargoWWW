var express = require('express')
  , router = express.Router()
  , async = require('async')
  , mongoose = require('lib/mongoose')
  , ObjectId = mongoose.Types.ObjectId
  , User = require('models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find({}).exec(function (err, users) {
    res.send(users);
  });
});

/* GET user by id. */
router.get('/:id', function (req, res, next) {
  try {
    var id = new ObjectId(req.params.id);
  } catch (e) {
    next();
    return;
  }

  User.findById(id).exec(function (err, user) {
    if (err) throw err;
    if (!user) {
      next();
      return;
    }
    res.send(user);
  });
});

/* GET populate users DB. */
router.get('/populate', function (req, res, next) {
  mongoose.connection.db.dropDatabase(function () {
    var users = [
      {
        email: 'cody.graham59@example.com',
        username: 'admin',
        firstname: 'Cody',
        lastname: 'Graham',
        password: 'sandwich',
        phone: '(890)-880-7242',
        role: 'admin'
      },
      {
        email: 'joyce.porter39@example.com',
        username: 'shipper',
        firstname: 'Joyce',
        lastname: 'Porter',
        password: 'doug',
        phone: '(965)-927-1285',
        role: 'shipper'
      },
      {
        email: 'kent.mason87@example.com',
        username: 'carrier',
        firstname: 'Kent',
        lastname: 'Mason',
        password: 'maxx',
        phone: '(153)-948-8628',
        role: 'carrier'
      }
    ];
    async.each(users, function (user, cb) {
      var newUser = new User(user);
      newUser.save(function () {
        cb();
      });
    }, function () {
      User.find({}).exec(function (err, users) {
        res.send(users);
      });
    });
  });
});

module.exports = router;
