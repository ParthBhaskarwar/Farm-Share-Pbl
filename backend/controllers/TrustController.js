const AppError = require('../AppError');
const OwnerTrust = require('./../models/OwnerTrustModel');
const RenterTrust=require('./../models/RenterTrustModel');
const calculateOwnerTrust = require('./../utils/ownerTrustCalculation');
const calculateRenterTrust = require('./../utils/renterTrustCalculation');


exports.createOrUpdateOwnerTrustScore = async (req, res, next) => {
  try {
    const ownerId = req.params.id;

    const {
      equipmentAccuracy,
      reliabilityStats,
      maintenanceStats,
      behaviorStats,
      ratings
    } = req.body;

    // calculate trust score
    const trustScore = calculateOwnerTrust({
      equipmentAccuracy,
      reliabilityStats,
      maintenanceStats,
      behaviorStats,
      ratings
    });

    // upsert (create if not exists, else update)
    const ownerTrust = await OwnerTrust.findOneAndUpdate(
      { ownerId },
      {
        ownerId,
        equipmentAccuracy,
        reliabilityStats,
        maintenanceStats,
        behaviorStats,
        ratings,
        trustScore
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: 'success',
      ownerTrust
    });

  } catch (err) {
    next(err);
  }
};

exports.createOrUpdateRenterTrustScore = async (req, res, next) => {
  try {
    const renterId = req.params.id;

    const {
      bookingStats,
      equipmentHandling,
      creditReliability,
      ratings,
      verification
    } = req.body;

    // calculate trust score
    const trustScore = calculateRenterTrust({
      bookingStats,
      equipmentHandling,
      creditReliability,
      ratings,
      verification
    });

    // upsert (create if not exists, else update)
    const renterTrust = await RenterTrust.findOneAndUpdate(
      { renterId },
      {
        renterId,
        bookingStats,
        equipmentHandling,
        creditReliability,
        ratings,
        verification,
        trustScore
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: 'success',
      renterTrust
    });

  } catch (err) {
    next(err);
  }
};

exports.getOwnerTrustScore=async(req,res,next)=>{
      const ownerId = req.params.id;

      const ownerTrustStats=await OwnerTrust.findOne({ownerId});

      if(!ownerTrustStats){
        return next(new AppError('There is no trust score for this owner',404));
      }

      res.status(200).json({
        status:'success',
        ownerTrustStats
      })
}

exports.getRenterTrustScore=async(req,res,next)=>{
      const renterId = req.params.id;

      const renterTrustStats=await RenterTrust.findOne({renterId});

      if(!renterTrustStats){
        return next(new AppError('There is no trust score for this renter',404));
      }

      res.status(200).json({
        status:'success',
        renterTrustStats
      });
}