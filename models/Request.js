var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var requestSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  category: {type: String},
  mode_of_dispatch: {type: String},
  nature_of_movement: {type: String},
  pickup_date: {type: Date},
  booking_point: {type: String},
  booking_pincode: {type: String},
  delivery_point: {type: String},
  delivery_pincode: {type: String},
  items: [{
    unit: {type: String},
    length: {type: String},
    breadth: {type: String},
    height: {type: String},
    measure: {type: String},
    weight: {type: String},
    units: {type: String}
  }],
  total_value: {type: Number},
  total_weight: {type: Number},
  permit: {type: Boolean},
  vehicle: {type: Boolean},
  door_pickup: {type: Boolean},
  packaging_service: {type: Boolean},
  transit_insurance: {type: Boolean},
  door_delivery: {type: Boolean},
  created: {type: Date},
  updated: {type: Date},
  status: {type: Boolean, default: false}
});

requestSchema.pre('save', function (next) {
  if (!this.created) {
    this.created = Date.now();
  } else {
    this.updated = Date.now();
  }
  next();
});

module.exports = mongoose.model('Request', requestSchema);