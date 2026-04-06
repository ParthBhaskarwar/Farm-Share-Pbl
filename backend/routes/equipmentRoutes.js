// routes/paymentRoutes.js
const express = require("express");
const AuthController=require('./../controllers/AuthController');
const EquipmentController=require('./../controllers/EquipmentController');
const HealthController=require('./../controllers/HealthController');
const priceController=require('./../controllers/priceController');
const ReviewController=require('./../controllers/ReviewController');
const SearchController=require('./../controllers/SearchController');
const multer=require('./../multer');
const router = express.Router();

router.post(
  '/:id',
  AuthController.protect,
  multer.uploadMultiple,
  EquipmentController.addEquipment
);

router.patch('/:id/available',AuthController.protect,EquipmentController.toggleAvailability)

router.get('/search',EquipmentController.getEquipment);

router.get('/:id',EquipmentController.getEquipmentById);



router.post('/review/:id',AuthController.protect,ReviewController.makeEquipmentReview);
router.get('/:id/review',AuthController.protect,ReviewController.getEquipmentReviews);
router.get('/health/:id', HealthController.getHealth);
router.post('/price/:id', priceController.showPrice);
router.get('/:id/similarEquipments', AuthController.protect, EquipmentController.getSimilarEquipments);
router.get('/catalog/crops',SearchController.getCrops);
router.get('/catalog/processes',SearchController.getProcesses);
router.get('/catalog/suggestions',SearchController.getSuggestions);
router.get('/catalog/types',SearchController.getTypes);
router.get('/catalog/type/:type',SearchController.getEquipmentByType);
router.get('/rating/:id',EquipmentController.getAverageRating);








module.exports = router;