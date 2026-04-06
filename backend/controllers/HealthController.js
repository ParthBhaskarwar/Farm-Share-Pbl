const AppError = require('../AppError');
const FarmerEquipmentModel = require('../models/FarmerEquipmentModel');
const Health=require('./../models/HealthScoreModel');

exports.submitInspection=async(req,res,next)=>{
    const id=req.params.id;
    const {
    
        equipmentCategory,
    
        inspections,
    
        totalScore,
    
        maxPossibleScore,
    
        verifiedBy,
    
        verifiedAt,
    comments}=req.body;
    
    const health=await Health.create({equipmentId:id,
    
        equipmentCategory,
    
        inspections,
    
        totalScore,
    
        maxPossibleScore,
    
        verifiedBy,
    
        verifiedAt,
    comments});

    await FarmerEquipmentModel.findByIdAndUpdate(id,{inspectionCompleted:true},{new:true});

      res.status(200).json({
        status:'success',
        message:'Inspection for equipment completed',
        health
      })
}

exports.getHealth=async(req,res,next)=>{
    const id=req.params.id;
    const equipment=FarmerEquipmentModel.findById(id);

    if(!equipment){
        return next(new AppError('There is no equipment with this id',404));
    }
    const health=await Health.findOne({equipmentId:id});

    if(!health){
        return next(new AppError('This equipment is under inspection',400));
    }

    res.status(200).json({
        status:'success',
        health
    })
}