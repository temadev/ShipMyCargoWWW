var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var cargoSchema = new Schema({
  location: {type: String},
  weight: {type: String},
  size: {type: String},
  category: {type: String},
  vehicle: {type: String},
  created: {type: Date},
  updated: {type: Date},
  status: {type: Boolean, default: true}
});

cargoSchema.pre('save', function (next) {
  if (!this.created) {
    this.created = Date.now();
  }
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Cargo', cargoSchema);