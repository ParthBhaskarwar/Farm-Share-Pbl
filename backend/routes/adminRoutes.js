const express=require('express');
const TrustController=require('./../controllers/TrustController');
const HealthController=require('./../controllers/HealthController');
const AuthController=require('./../controllers/AuthController');
const EquipmentController=require('./../controllers/EquipmentController');

const router=express.Router();

router.patch('/ownerTrust/:id', TrustController.createOrUpdateOwnerTrustScore);
router.patch('/renterTrust/:id', TrustController.createOrUpdateRenterTrustScore);
router.post('/inspection/:id', HealthController.submitInspection);
router.post('/:id/publish',AuthController.protect,EquipmentController.calculateHealthAndPublish);

module.exports=router;