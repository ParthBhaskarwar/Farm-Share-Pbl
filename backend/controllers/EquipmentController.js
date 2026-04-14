const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const AppError = require('./../AppError');
const uploadBuffer = require('./../uploadToCloudinary');
const calculatePrice = require('./../utils/priceEngine');
const { deleteFromCloudinary } = require('./../cloudinary');
const HealthScore = require('../models/HealthScoreModel');
const FarmerEquipmentModel = require('../models/FarmerEquipmentModel');
const EquipmentCatalogModel = require('../models/EquipmentCatalogModel');
const BookingModel = require('../models/BookingModel');
const EquipmentReviewModel = require('../models/EquipmentReviewModel');

exports.addEquipment = async (req, res, next) => {
   if (!req.files || req.files.length === 0) {
      return next(new AppError("At least one image is required", 400));
   }

   const uploadedImages = [];

   for (const file of req.files) {
      const result = await uploadBuffer(file.buffer, "equipments");
      uploadedImages.push({
         url: result.secure_url,
         public_id: result.public_id
      });
   }

   try {
      // In equipmentController.js addEquipment


      const specs = req.body.specs ? JSON.parse(req.body.specs) : {};
      const {
         pricePerHour,
         hasInsurance,
         includesOperator,
         lastServiceDate,
         nextServiceDate,
         latitude,
         longitude
      } = req.body;

      const equipment = await FarmerEquipmentModel.create({
         equipment: req.params.id,
         images: uploadedImages,
         pricePerHour,
         hasInsurance,
         includesOperator,
         specs,
         lastServiceDate,
         nextServiceDate,
         location: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)] // [lng, lat] - GeoJSON format
         },
         farmer: req.farmer._id,
         status: 'listed',
         available: false,
         dynamicPrice: null,
         inspectionCompleted: false,
         equipmentPublished: false
      });

      await equipment.save();

      res.status(200).json({
         status: 'success',
         message: 'Equipment listed successfully',
         equipment
      })
   } catch (err) {
      console.log(err);
      return next(new AppError(err.message, 400));
   }
}

exports.calculateHealthAndPublish = async (req, res, next) => {
   try {
      const equipment = await FarmerEquipmentModel.findById(req.params.id);

      if (!equipment) {
         return next(new AppError('There is no equipment found with this id', 404));
      }

      if (!equipment.inspectionCompleted) {
         return next(new AppError('Inspection is not done for this equipment'));
      };

      if (equipment.equipmentPublished) {
         return next(new AppError('This equipment is already published', 400));
      };

      const health = await HealthScore.findOne({ equipmentId: req.params.id }); // ✅ Fetch health

      const totalUnits = await FarmerEquipmentModel.countDocuments({
         equipment: equipment.equipment
      });

      const { basePrice } = calculatePrice({
         baseHourlyRate: equipment.pricePerHour,
         healthScore: health.totalScore,
         purchaseYear: equipment.specs.year,
         activeBookingsForThisEquipment: 0,
         totalUnitsOfThisEquipment: totalUnits,
         distanceKm: 0,
         duration: 1,
         hasOperator: equipment.includesOperator,
         hasTransport: equipment.includesTransport,
         isOperatorRequired: false,
         isTransportRequired: false,
         workAmount: 0,
         landSize: 0
      });

      equipment.dynamicPrice = basePrice;
      equipment.status = 'published';
      equipment.available = true;
      equipment.equipmentPublished = true;

      await equipment.save();

      res.status(200).json({
         status: 'success',
         equipment
      })
   } catch (err) {
      console.log(err.message);
   }
};

exports.getEquipmentById = async (req, res) => {
   try {
      const { id } = req.params;

      const equipment = await FarmerEquipmentModel
         .findById(id)
         .populate('farmer', 'name village district trustScore phone_number')
         .populate('equipment')
         .lean();

      if (!equipment) {
         return res.status(404).json({
            status: "fail",
            message: "Equipment not found"
         });
      }

      // Calculate Real-time Dynamic Price
      const health = await HealthScore.findOne({ equipmentId: id });
      const totalUnitsOfThisEquipment = await FarmerEquipmentModel.countDocuments({
         equipment: equipment.equipment._id
      });
      const activeBookingsForThisEquipment = await BookingModel.countDocuments({
         equipment: id,
         bookingStatus: { $ne: 'cancelled' }
      });

      const { dynamicPrice, dynamicBase } = calculatePrice({
         baseHourlyRate: equipment.pricePerHour,
         healthScore: health?.totalScore || 80,
         purchaseYear: equipment.specs.year,
         activeBookingsForThisEquipment,
         totalUnitsOfThisEquipment,
         distanceKm: 0, 
         duration: 1,
         hasOperator: equipment.includesOperator,
         hasTransport: false,
         isOperatorRequired: false,
         isTransportRequired: false,
         workAmount: 0,
         landSize: 0
      });

      equipment.dynamicPrice = dynamicPrice;
      equipment.dynamicBase = dynamicBase;

      res.status(200).json({
         status: "success",
         equipment
      });

   } catch (err) {
      console.error("getEquipmentById error:", err);

      res.status(500).json({
         status: "error",
         message: err.message
      });
   }
};

exports.getEquipment = async (req, res, next) => {
   try {
      const {
         latitude,
         longitude,
         equipmentType,
         sort,
         crop,
         process,
         condition,
         priceRange,
         distance,
         hasInsurance
      } = req.query;

      let pipeline = [];

      // ✅ STEP 1: $geoNear MUST be first (if location provided)
      if (latitude && longitude) {
         pipeline.push({
            $geoNear: {
               near: {
                  type: 'Point',
                  coordinates: [parseFloat(longitude), parseFloat(latitude)]
               },
               distanceField: 'distance',
               distanceMultiplier: 0.001, // meters to km
               spherical: true,
               query: {
                  status: 'published',
                  available: true
               },
               ...(distance && { maxDistance: parseFloat(distance) * 1000 }) // km to meters
            }
         });
      } else {
         // No location provided, use regular $match
         pipeline.push({
            $match: {
               status: 'published',
               available: true
            }
         });
      }

      // ✅ STEP 2: Populate Equipment Catalog
      pipeline.push({
         $lookup: {
            from: 'equipmentcatalogs',
            localField: 'equipment',
            foreignField: '_id',
            as: 'equipmentDetails'
         }
      });

      pipeline.push({
         $unwind: '$equipmentDetails'
      });

      // ✅ STEP 3: Filter by Equipment Type (from catalog)
      if (equipmentType) {
         pipeline.push({
            $match: {
               'equipmentDetails.equipmentType': {
                  $regex: `^${equipmentType}$`,
                  $options: 'i'
               }
            }
         });
      }

      if (crop) {
         pipeline.push({
            $match: {
               'equipmentDetails.suitableCrops': {
                  $elemMatch: { $regex: `^${crop}$`, $options: 'i' }
               }
            }
         });
      }

      if (process) {
         pipeline.push({
            $match: {
               'equipmentDetails.suitableProcesses': {
                  $elemMatch: {
                     process: { $regex: `^${process}$`, $options: 'i' }  // ✅ match the 'process' field inside each object
                  }
               }
            }
         });
      }

      // ✅ STEP 4: Filter by Condition (inspector-filled)
      if (condition) {
         pipeline.push({
            $match: { condition }
         });
      }

      // ✅ STEP 5: Filter by Price Range
      if (priceRange) {
         const [min, max] = priceRange.split('-').map(Number);
         pipeline.push({
            $match: {
               pricePerHour: { $gte: min, $lte: max }
            }
         });
      }

      // ✅ STEP 6: Filter by Insurance
      if (hasInsurance === 'true') {
         pipeline.push({
            $match: { hasInsurance: true }
         });
      }

      // ✅ STEP 7: Populate Farmer Details
      pipeline.push({
         $lookup: {
            from: 'farmers',
            localField: 'farmer',
            foreignField: '_id',
            as: 'farmerDetails'
         }
      });

      pipeline.push({
         $unwind: '$farmerDetails'
      });

      // ✅ STEP 8: Project Final Fields
      pipeline.push({
         $project: {
            // From Equipment Catalog
            equipmentName: '$equipmentDetails.equipmentName',
            equipmentType: '$equipmentDetails.equipmentType',
            suitableCrops: '$equipmentDetails.suitableCrops',
            suitableProcesses: '$equipmentDetails.suitableProcesses',
            description: '$equipmentDetails.description',
            features: '$equipmentDetails.features',

            // From Farmer Equipment
            images: 1,
            pricePerHour: 1,
            available: 1,
            hasInsurance: 1,
            includesOperator: 1,
            specs: 1,
            lastServiceDate: 1,
            nextServiceDate: 1,
            condition: 1,
            location: 1,
            dynamicPrice: 1,
            distance: 1, // Calculated by $geoNear

            // Farmer Details
            farmer: {
               _id: '$farmerDetails._id',
               name: '$farmerDetails.name',
               village: '$farmerDetails.village',
               district: '$farmerDetails.district',
               trustScore: '$farmerDetails.trustScore',
               phone_number: '$farmerDetails.phone_number'
            }
         }
      });

      // ✅ STEP 9: Sorting
      if (sort) {
         // Custom sort options
         if (sort === 'price-low') {
            pipeline.push({ $sort: { pricePerHour: 1 } });
         } else if (sort === 'price-high') {
            pipeline.push({ $sort: { pricePerHour: -1 } });
         } else if (sort === 'highly-rated') {
            pipeline.push({ $sort: { 'farmer.trustScore': -1 } });
         } else if (sort === 'distance' && latitude && longitude) {
            pipeline.push({ $sort: { distance: 1 } });
         } else {
            // Generic sort
            const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            pipeline.push({ $sort: { [sortField]: sortOrder } });
         }
      } else if (latitude && longitude) {
         // Default: sort by distance if location provided
         pipeline.push({ $sort: { distance: 1 } });
      } else {
         // Default: sort by trust score
         pipeline.push({ $sort: { 'farmer.trustScore': -1 } });
      }

      // ✅ STEP 10: Execute Pipeline
      let equipment = await FarmerEquipmentModel.aggregate(pipeline);

      // ✅ STEP 11: Calculate Real-time Dynamic Prices
      equipment = await Promise.all(equipment.map(async (item) => {
         const health = await HealthScore.findOne({ equipmentId: item._id });
         
         // Using the logic defined in your priceController.js but for generic discovery
         const totalUnitsOfThisEquipment = await FarmerEquipmentModel.countDocuments({
            equipment: item.equipment // This is the ID of the EquipmentCatalog entry
         });

         const activeBookingsForThisEquipment = await BookingModel.countDocuments({
            equipment: item._id,
            bookingStatus: { $ne: 'cancelled' }
         });

         const { dynamicPrice, dynamicBase } = calculatePrice({
            baseHourlyRate: item.pricePerHour,
            healthScore: health?.totalScore || 80,
            purchaseYear: item.specs.year,
            activeBookingsForThisEquipment,
            totalUnitsOfThisEquipment,
            distanceKm: item.distance || 0,
            duration: 1, // Default base duration for search listing
            hasOperator: item.includesOperator,
            hasTransport: false, // Default context for search listing
            isOperatorRequired: false,
            isTransportRequired: false,
            workAmount: 0,
            landSize: 0
         });

         return { ...item, dynamicPrice, dynamicBase };
      }));

      res.status(200).json({
         status: 'success',
         results: equipment.length,
         equipment
      });

   } catch (err) {
      console.error('getEquipment Error:', err);
      next(err);
   }
};

exports.getSimilarEquipments = async (req, res, next) => {
   try {
      const id = req.params.id;

      const equipment = await FarmerEquipmentModel.findById(id);

      const similarEquipments = await FarmerEquipmentModel.find({
         equipment: equipment.equipment,
         _id: { $ne: id }
      }).populate('farmer', 'village trustScore');

      res.status(200).json({
         status: 'success',
         similarEquipments
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Server error' });
   }
};


exports.uploadEquipmentImages = async (req, res, next) => {
   try {
      if (!req.files || req.files.length === 0) {
         return next(new AppError('No images uploaded', 400));
      }

      const imageUrls = [];

      for (const file of req.files) {
         const result = await uploadBuffer(file.buffer, "equipments");
         imageUrls.push(result.secure_url);
      }

      const equipment = await FarmerEquipmentModel.findByIdAndUpdate(
         req.params.id,
         { $push: { images: { $each: imageUrls } } },
         { new: true }
      );

      res.json(equipment);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

exports.uploadTempImages = async (req, res, next) => {
   try {
      if (!req.files || req.files.length === 0) {
         return next(new AppError("No images uploaded", 400));
      }

      const imageUrls = [];

      for (const file of req.files) {
         const result = await uploadBuffer(file.buffer, "equipments");
         imageUrls.push(result.secure_url);
      }

      res.status(200).json({
         status: "success",
         images: imageUrls
      });
   } catch (err) {
      next(err);
   }
};


exports.toggleAvailability = async (req, res) => {
   const equipment = await FarmerEquipmentModel.findById(req.params.id);

   if (!equipment.inspectionCompleted) {
      return next(new AppError('Equipment is under inspection', 400));
   }

   if (!equipment.equipmentPublished) {
      return next(new AppError('Equipment is not published', 400));
   }

   const booking = await BookingModel.findOne({ equipment: equipment._id });

   if (booking) {
      return next(new AppError('Equipment is rented', 400));
   }
   equipment.available = !equipment.available;
   await equipment.save({ validateBeforeSave: false });
   res.json({ status: 'success', equipment });
};

exports.getAverageRating = async (req, res, next) => {

   const equipment = await FarmerEquipmentModel.findById(req.params.id);

   if (!equipment) {
      return next(new AppError('Equipment not found', 404));
   }

   const result = await EquipmentReviewModel.aggregate([
      
        { $match: { equipment: new mongoose.Types.ObjectId(req.params.id) } }
      ,
      {
         $group: {
            _id: "$equipment",
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
         }
      }
   ]);

   const avgRating = result.length > 0 ? Number(result[0].avgRating.toFixed(1)) : 0;

   res.status(200).json({
      status: 'success',
      avgRating
   })
}



