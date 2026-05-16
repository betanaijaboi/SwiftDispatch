const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  address: { type: String, required: true },
  name: String,
  placeId: String,
});

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickup: { type: locationSchema, required: true },
    dropoff: { type: locationSchema, required: true },
    vehicleType: {
      type: String,
      enum: ['bike', 'bicycle', 'car', 'van'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'searching', 'accepted', 'pickup', 'in_transit', 'delivered', 'cancelled', 'rated'],
      default: 'searching',
    },
    price: { type: Number, required: true },
    distance: { type: Number },
    estimatedTime: { type: Number },
    note: { type: String },
    packageDescription: { type: String },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'wallet'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    cancellationReason: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    acceptedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ customerId: 1, status: 1 });
orderSchema.index({ riderId: 1, status: 1 });
orderSchema.index({ status: 1, vehicleType: 1 });

module.exports = mongoose.model('Order', orderSchema);
