const AppError = require("../AppError");
const EquipmentCatalogModel = require("../models/EquipmentCatalogModel")

exports.getTypes=async(req,res,next)=>{
    try{
    const types=await EquipmentCatalogModel.distinct('equipmentType');

    if(!types){
        return next(new AppError('There are no types available',400));
    }

    res.status(200).json({
        status:'success',
        types
    });
}catch(err){
    next(err);
}
}

exports.getCrops=async(req,res,next)=>{
    try{
    const crops=await EquipmentCatalogModel.distinct('suitableCrops');

    if(!crops){
        return next(new AppError('There are no crops available',400));
    }

    res.status(200).json({
        status:'success',
        crops
    });
    }catch(err){
    next(err);
}
    
}

exports.getProcesses=async(req,res,next)=>{
    try{
    const processes=await EquipmentCatalogModel.distinct('suitableProcesses.process');

    if(!processes){
        return next(new AppError('There no processes',400));
    }

    res.status(200).json({
        status:'success',
        processes
    })
    }catch(err){
    next(err);
}
}

exports.getSuggestions = async (req, res, next) => {
  try {

    const { crop, process } = req.query;
    const query = {};

    if (crop) query.suitableCrops = crop;

    if (process) query['suitableProcesses.process'] = process;

    const equipments = await EquipmentCatalogModel
      .find(query)
      .distinct('equipmentName');

    res.status(200).json({
      status: 'success',
      suggestions: equipments
    });

  } catch (err) {
    next(err);
  }
};


exports.getEquipmentByType = async (req, res, next) => {
  try {
    const { type } = req.params;

    const equipment = await EquipmentCatalogModel.find({ equipmentType: type });

    res.status(200).json({
      status: 'success',
      equipment
    });
  } catch (err) {
    next(err);
  }
};