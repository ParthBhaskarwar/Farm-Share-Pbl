const express=require('express');
const AuthController=require('./../controllers/AuthController');

const router=express.Router();

router.post('/start-signup', AuthController.startSignup);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/complete-signup', AuthController.completeSignup);
router.post('/login', AuthController.Login);
router.post('/google-login',AuthController.googleLogin);
router.post('/forgotPassword', AuthController.forgotPassword);
router.post('/resetPassword/:token', AuthController.resetPassword);
router.post('/logout', AuthController.logout);

module.exports=router;