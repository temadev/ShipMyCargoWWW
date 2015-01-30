var express = require('express')
	, router = express.Router()
	, User = require('models/User');


router.get('/', function(req, res, next) {
		res.render('index', { title: 'Ship Anything, Anytime, Anywhere' })
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
