var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var citySchema = new Schema({
  title: {type: String},
  state: {type: String},
  country: {type: String}
});

module.exports = mongoose.model('City', citySchema);