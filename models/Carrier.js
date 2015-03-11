var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var carrierSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  name: {type: String},
  country: {type: String},
  state: {type: String},
  city: {type: String},
  address: {type: String},
  zipcode: {type: String},
  phone: {type: String},
  year: {type: Number},
  website: {type: String},
  location: {type: String},
  player_type: {type: String},
  min_weight: {type: Number},
  max_weight: {type: Number},
  length: {type: Number},
  breadth: {type: Number},
  height: {type: Number},
  category: [{type: String}],
  vehicles: [{type: String}],
  vehicles_count: {type: Number},
  min_vehicle_capacity: {type: Number},
  max_vehicle_capacity: {type: Number},
  payment: [{type: String}],
  transit_insurance: {type: Boolean},
  door_pickup: {type: Boolean},
  door_delivery: {type: Boolean},
  detention_charges: {type: Boolean},
  packaging_service: {type: Boolean},
  other: {type: String},
  booking_points: [{type: String}],
  delivery_points: [{type: String}],
  created: {type: Date},
  updated: {type: Date},
  status: {type: Boolean}
});

carrierSchema.pre('save', function (next) {
  if (!this.created) {
    this.created = Date.now();
  }
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Carrier', carrierSchema);