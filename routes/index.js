var express = require('express')
	, router = express.Router()
	, User = require('models/User');


router.get('/', function(req, res, next) {
	if (req.user) {
		if (req.user.role === 'shipper') {
			res.redirect('/shipment/create');
			return;
		}
		if (req.user.role === 'carrier') {
			res.redirect('/shipment');
			return;
		}
		if (req.user.role === 'admin') {
			res.redirect('/shipment');
		}
	} else {
		next();
	}
});


router.post('/enquiry', function(req, res, next) {
	res.send();
});

/* GET user by id. */
router.get('/profile', function (req, res, next) {
	if (req.user) {
		User.findById(req.user._id).exec(function (err, user) {
			if (err) throw err;
			if (!user) {
				next();
				return;
			}
			res.send(user);
		});
	} else {
		next();
	}
});

module.exports = router;
