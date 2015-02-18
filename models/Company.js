var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var companySchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  name: {type: String},
  address: {type: String},
  year: {type: String},
  website: {type: String},
  booking_points: {type: String},
  delivery_points: {type: String},
  location: {type: String},
  player_type: {type: String},
  player_category: {type: String},
  dispatch: {type: String},
  weight: {type: Number},
  size: {type: Number},
  product_category: {type: String},
  product: {type: String},
  product_nothandled: {type: String},
  vehicle: {type: String},
  payment: [{type: String}],
  vehicle_closed: {type: Boolean},
  transit_insurance: {type: Boolean},
  door_pickup: {type: Boolean},
  door_delivery: {type: Boolean},
  detention_charges: {type: Boolean},
  packaging_service: {type: Boolean},
  other: {type: String},
  routes: {type: String},
  images: {type: String},
  latitude: {type: Number},
  longtitude: {type: Number},
  vehicles_count: {type: Number},
  min_vehicle_capacity: {type: Number},
  max_vehicle_capacity: {type: Number},
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