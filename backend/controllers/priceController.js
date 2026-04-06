const calculatePrice = require('./../utils/priceEngine');
const HealthScore = require('./../models/HealthScoreModel');
const Booking = require("../models/BookingModel");
const FarmerEquipmentModel = require('../models/FarmerEquipmentModel');
const EquipmentCatalogModel=require('./../models/EquipmentCatalogModel');

async function getTotalUnitsOfEquipment(equipment) {
  return await FarmerEquipmentModel.countDocuments({
    equipment: equipment.equipment
  });
};

async function getTotalBookings(equipmentId) {
  return await Booking.countDocuments({
    equipment: equipmentId
  });
};

exports.showPrice = async (req, res, next) => {
  const { isOperatorRequired,isTransportRequired } = req.body;
  const equipmentId = req.params.id;
  const equipment = await FarmerEquipmentModel.findById(equipmentId);
  const baseHourlyRate = equipment.pricePerHour;
  const health = await HealthScore.findOne({ equipmentId });
  const healthScore = health?.totalScore;
  const purchaseYear = equipment.specs.year;
  const activeBookingsForThisEquipment = await getTotalBookings(equipmentId);
  const totalUnitsOfThisEquipment = await getTotalUnitsOfEquipment(equipment);
  const distanceKm = req.body.distance;
  const hasOperator = equipment.includesOperator;
  const hasTransport=equipment.includesTransport;
  let workAmount=0;
  let landSize= 0;
  let duration=req.body.duration;

  if (hasOperator && isOperatorRequired) {
    const baseEquipment = await EquipmentCatalogModel.findById(equipment.equipment);

    const selectedProcess = baseEquipment.suitableProcesses.find(
      p => p.process === req.body.process
    );

    workAmount = selectedProcess.amount;
    duration=selectedProcess.duration;
    landSize=req.body.landSize;
  }

  const { basePrice, deliveryCharge, operatorCharge, dynamicPrice ,platformCharge} = calculatePrice({
    baseHourlyRate,
    healthScore,
    purchaseYear,
    activeBookingsForThisEquipment,
    totalUnitsOfThisEquipment,
    distanceKm,
    duration,
    hasOperator,
    hasTransport,
    isOperatorRequired,
    isTransportRequired,
    workAmount,
    landSize
  });

  res.status(200).json({
    status: 'success',
    basePrice, deliveryCharge, operatorCharge, dynamicPrice,platformCharge
  });
}