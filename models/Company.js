var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var companySchema = new Schema({
  name: {type: String},
  address: {type: String},
  year: {type: String},
  website: {type: String},
  created: {type: Date},
  updated: {type: Date},
  status: {type: Boolean, default: true}
});

companySchema.pre('save', function (next) {
  if (!this.created) {
    this.created = Date.now();
  }
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Company', companySchema);