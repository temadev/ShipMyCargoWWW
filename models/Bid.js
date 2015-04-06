var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var bidSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  request: {type: Schema.Types.ObjectId, ref: 'Request'},
  freight: {type: Number},
  transit_time: {type: Number},
  validity_hours: {type: Number},
  insurance: {type: Boolean},

  created: {type: Date},
  updated: {type: Date},
  status: {type: Boolean, default: false}
});

bidSchema.pre('save', function (next) {
  if (!this.created) {
    this.created = Date.now();
  } else {
    this.updated = Date.now();
  }
  next();
});

module.exports = mongoose.model('Bid', bidSchema);