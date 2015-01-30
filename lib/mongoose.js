var config = require('lib/config')
  , mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI, config.get('mongoose:options'));

module.exports = mongoose;