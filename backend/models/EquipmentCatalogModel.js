const mongoose = require('mongoose');

const EquipmentCatalogSchema = mongoose.Schema({
  equipmentName: {
    type: String,
    required: [true, 'Please give name of equipment'],
    unique: true 
  },

  equipmentType: {
    type: String,
    required: [true, 'Please give equipment type']
  },

  suitableCrops: {
    type: [String],
    required: [true, 'Please give suitable crops for equipment']
  },

  suitableProcesses:[ 
    {
      process:String,
      duration:Number,
      amount:Number
    }
  ],

  description: {
    type: String,
    required: [true, 'Please give description']
  },

  features: { 
    type: [String],
    default: []
  },

}, { timestamps: true });

const EquipmentCatalogModel = mongoose.model('EquipmentCatalog', EquipmentCatalogSchema);

module.exports = EquipmentCatalogModel;