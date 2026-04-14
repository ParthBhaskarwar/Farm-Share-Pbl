// routes/paymentRoutes.js
const express = require("express");
const AuthController=require('../controllers/AuthController');
const BookingController=require('../controllers/BookingController');
const multer=require('../multer');

const router = express.Router();

router.post("/create-order/:id",AuthController.protect,BookingController.createBooking );
router.get("/booked-slots/:id", AuthController.protect, BookingController.getBookedSlots);
router.post("/verify-payment",AuthController.protect, BookingController.verifyPayment);
router.post("/:id/upload-pickup-image",AuthController.protect,multer.uploadPickupPhoto,BookingController.uploadPickupImage);
router.post("/:id/upload-return-image",AuthController.protect,multer.uploadReturnPhoto,BookingController.uploadReturnImage);
router.post("/:id/confirm-pickup",AuthController.protect,BookingController.confirmPickup);
router.post("/:id/confirm-return",AuthController.protect,BookingController.confirmReturn);

module.exports = router;
