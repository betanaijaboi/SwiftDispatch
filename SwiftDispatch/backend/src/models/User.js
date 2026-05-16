const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['customer', 'rider'], required: true },
    avatar: { type: String },
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    totalRides: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    // Rider-specific fields
    vehicleType: { type: String, enum: ['bike', 'bicycle', 'car', 'van'] },
    vehiclePlate: { type: String },
    vehicleColor: { type: String },
    isOnline: { type: Boolean, default: false },
    currentLocation: {
      latitude: Number,
      longitude: Number,
    },
    earnings: { type: Number, default: 0 },
    completedDeliveries: { type: Number, default: 0 },
    socketId: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.socketId;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
