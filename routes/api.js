var express = require('express')
  , async = require('async')
  , router = express.Router()
  , City = require('models/City');

router.get('/cities', function (req, res) {

  var regex = new RegExp(req.query.query, 'i');
  var suggestions = [];

  City
    .find({title: regex})
    .sort({'title': 1})
    .limit(10)
    .exec(function (err, cities) {
      async.each(cities, function (city, cb) {
        var curCity = {
          data: city._id,
          value: city.title + ' (' + city.state + ')'
        };
        suggestions.push(curCity);
        cb();
      }, function (err) {
        res.json({
          query: req.query.query,
          suggestions: suggestions
        });
      });
    });

});


module.exports = router;