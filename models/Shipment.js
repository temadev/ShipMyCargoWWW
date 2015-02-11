var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var shipmentSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  booking_point: {type: String},
  delivery_point: {type: String},
  routes: {type: String},
  latitude: {type: String},
  longitude: {type: String},
  dispatch: {type: String},
  weight: {type: Number},
  size: {type: Number},
  product_category: {type: String},
  payment: [{type: String}],
  vehicle: {type: Boolean},
  transit_insurance: {type: Boolean},
  door_pickup: {type: Boolean},
  door_delivery: {type: Boolean},
  detention_charges: {type: Boolean},
  packaging_service: {type: Boolean},
  other: {type: String},
  created: {type: Date},
  updated: {type: Date},
  status: {type: Boolean, default: true}
});

shipmentSchema.pre('save', function (next) {
  if (!this.created) {
    this.created = Date.now();
  }
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);