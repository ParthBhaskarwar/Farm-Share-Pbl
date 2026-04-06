const mongoose = require('mongoose');

const FarmerEquipmentSchema = mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentCatalog', 
    required: true
  },

  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],

  pricePerHour: {
    type: Number,
    required: [true, 'Please give price of renting equipment for 1 day']
  },

  available: {
    type: Boolean,
    default: false
  },

  hasInsurance: {
    type: Boolean,
    required: true
  },

  includesOperator: {
    type: Boolean,
    required: true
  },

  includesTransport:{
    type: Boolean,
    required: true
  },

  specs: {
    year: { type: Number, required: true },
    hours: { type: Number, required: true }
  },

  lastServiceDate: {
    type: String,
    required: [true, 'Please give last service date']
  },

  nextServiceDate: {
    type: String,
    required: [true, 'Please give next service date']
  },

  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },

  condition: { 
    type: String,
    enum: ["Excellent", "Good", "Fair"]
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  dynamicPrice: {
    type: Number
  },

  status: {
    type: String,
    enum: ['listed', 'published'],
    default: 'listed'
  },

  inspectionCompleted: {
    type: Boolean,
    default: false
  },

  equipmentPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

FarmerEquipmentSchema.index({ location: '2dsphere' });

const FarmerEquipmentModel = mongoose.model('FarmerEquipment', FarmerEquipmentSchema);

module.exports = FarmerEquipmentModel;