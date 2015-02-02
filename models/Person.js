var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var personSchema = new Schema({
  company: {type: Schema.Types.ObjectId, ref: 'Company'},
  firstname: {type: String},
  lastname: {type: String},
  phone: {type: String},
  email: {type: String},
  designation: {type: String},
  created: {type: Date},
  updated: {type: Date},
  status: {type: Boolean, default: true}
});

personSchema.pre('save', function (next) {
  if (!this.created) {
    this.created = Date.now();
  }
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Person', personSchema);