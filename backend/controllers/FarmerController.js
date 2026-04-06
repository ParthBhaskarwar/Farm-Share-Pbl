const jwt = require('jsonwebtoken');
const Farmer =require('./../models/FarmerModel');
const AppError = require('./../AppError');
const uploadBuffer = require('./../uploadToCloudinary');
const FarmerEquipmentModel = require('../models/FarmerEquipmentModel');

exports.getFarmer=async(req,res,next)=>{
    const farmer=req.farmer
    console.log(farmer);
    res.status(200).json({
        farmer
        
    })
};

exports.updateFarmerProfile = async (req, res, next) => {
  try {
    const updates = {};

    // 1. Handle photo upload if present
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, "farmers");
      updates.photo = result.secure_url;
    }

    // 2. Handle text fields
    if (req.body.name) updates.name = req.body.name;
    if (req.body.village) updates.village = req.body.village;
    if (req.body.district) updates.district = req.body.district;
    if (req.body.preferredLanguage) updates.preferredLanguage = req.body.preferredLanguage;
    if (req.body.notificationPreference) updates.notificationPreference = req.body.notificationPreference;

    // 3. Parse JSON arrays (sent as strings from FormData)
    if (req.body.preferredCrops) {
      updates.preferredCrops = typeof req.body.preferredCrops === 'string'
        ? JSON.parse(req.body.preferredCrops)
        : req.body.preferredCrops;
    }

    // 4. Update farmer in database
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      req.farmer._id, // ✅ Use _id not id
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      farmer: updatedFarmer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: 'error',
      message: err.message 
    });
  }
};

exports.uploadFarmerPhoto=async(req,res,next)=>{
 try {
    console.log(req.body);
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await uploadBuffer(req.file.buffer, "farmers");

    const farmer = await Farmer.findByIdAndUpdate(
      req.farmer._id,
      { photo: result.secure_url },
      { new: true }
    );

    res.status(200).json({ farmer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getMyEquipments = async (req, res, next) => {
   try {
      const equipments = await FarmerEquipmentModel.find({farmer:req.farmer._id});

      res.status(200).json({
         status: 'success',
         equipments
      });
   } catch (err) {
      console.error(err);
   }
};