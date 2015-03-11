var express = require('express')
  , async = require('async')
  , router = express.Router()
  , City = require('models/City');

router.get('/cities', function (req, res) {

  var regex = new RegExp(req.query.query, 'i');
  var suggestions = [];

  City
    .find({title: regex})
    .sort({title: 1})
    .exec(function (err, cities) {
      async.each(cities, function (city, cb) {
        var curCity = {
          data: city._id,
          //value: city.title + ' (' + city.state + ')'
          value: city.title
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

router.get('/cities/:state', function (req, res) {


  var regex = new RegExp(req.query.query, 'i');
  var suggestions = [];
  var query = {title: regex};
  if (req.params.state) {
    query.state = req.params.state;
  }

  City
    .find(query)
    .sort({title: 1})
    .exec(function (err, cities) {
      async.each(cities, function (city, cb) {
        var curCity = {
          data: city._id,
          value: city.title
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

router.get('/states', function (req, res) {

  var regex = new RegExp(req.query.query, 'i');
  var suggestions = [];

  City
    .find({state: regex})
    .sort({state: 1})
    .exec(function (err, states) {
      var curStates = [];
      async.each(states, function (state, cb) {
        var curState = {
          data: state.state,
          value: state.state
        };
        suggestions.push(curState);
        cb();
      }, function (err) {
        unique(suggestions, function(err, items) {
          res.json({
            query: req.query.query,
            suggestions: items
          });
        });
      });
    });

});


module.exports = router;


function unique(objAry, callback) {
  var results = [];

  function valMatch(seen, obj) {
    var key, match, other, val, _i, _len;
    for (_i = 0, _len = seen.length; _i < _len; _i++) {
      other = seen[_i];
      match = true;
      for (key in obj) {
        val = obj[key];
        if (other[key] !== val) {
          match = false;
        }
      }
      if (match) {
        return true;
      }
    }
    return false;
  }

  objAry.forEach(function (item) {
    if (!valMatch(results, item)) {
      return results.push(item);
    }
  });
  return callback(null, results);
}