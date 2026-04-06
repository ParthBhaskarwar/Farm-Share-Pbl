const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },

  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmerEquipment',
    required: true
  },

  startDate: {
    type: Date,
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },

  timeSlot: {
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    }
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  bookingStatus: {
    type: String,
    enum: ["confirmed", "active", "cancelled", "completed", "pending"],
    default: "pending",
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  pickupImageUploaded:
  {
    type: Boolean,
    default: false
  },
  pickupConfirmed:
  {
    type: Boolean,
    default: false
  },
  pickupOtp:
  {
    type: String
  },
  pickupOtpExpiry:
  {
    type: Date
  },

  returnImageUploaded:
  {
    type: Boolean,
    default: false
  },
  returnConfirmed:
  {
    type: Boolean,
    default: false
  },
  returnOtp:
  {
    type: String
  },
  returnOtpExpiry:
  {
    type: Date
  },

  pickupImage:
  {
    url: { type: String },
    public_id: { type: String }
  },
  returnImage:
  {
    url: { type: String },
    public_id: { type: String }
  },
  isTransportRequired:{
    type:Boolean,
    default:false
  },
  isOperatorRequired:{
    type:Boolean,
    default:false
  },
  service:{
    process:String,
    landSize:Number
  }
}
);

module.exports = mongoose.model("Booking", bookingSchema);
