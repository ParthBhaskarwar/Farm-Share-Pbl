const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const FarmerModel = require('./../models/FarmerModel');
const AppError = require('./../AppError');
const { promisify } = require('util');
const { sendResetEmail, sendVerifyEmail } = require("./../mailService");
const client = require('./../googleAuth');


const sendToken = (farmer, statusCode, res) => {
    const token = jwt.sign(
        { id: farmer._id },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        token
    });
};

exports.Login = async (req, res, next) => {
    const { email, password } = req.body;

    const farmer = await FarmerModel.findOne({ email });

    if (!farmer) {
        return next(new AppError('There is no farmer with provided email', 404));
    }

    if (!await farmer.checkPassword(password, farmer.password)) {
        return next(new AppError('Incorrect Password Plaese provide correct one', 400));
    }

    sendToken(farmer, 200, res);
}

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);


    const currentFarmer = await FarmerModel.findById(decoded.id);
    if (!currentFarmer) {
        return next(
            new AppError(
                'The farmer belonging to this token does no longer exist.',
                401
            )
        );
    }

    if (currentFarmer.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    req.farmer = currentFarmer;

    next();
}

exports.checkAuth = async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        farmer: {
            _id: req.farmer._id,
            name: req.farmer.name,
            email: req.farmer.email
        }
    });
};

exports.forgotPassword = async (req, res, next) => {
    const email = req.body.email;

    if (!email) {
        return next(new AppError('Please provide email', 400));
    }

    const farmer = await FarmerModel.findOne({ email });
    if (!farmer) {
        return next(new AppError('There is no farmer with this email', 404));
    }

    const resetToken = farmer.getResetPasswordToken();
    console.log(resetToken);
    await farmer.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await sendResetEmail(email, resetUrl);

    res.status(200).json({
        status: 'success',
        message: 'Reset email sent successfully'
    })


}

exports.resetPassword = async (req, res, next) => {
    const hashedToken = await crypto.createHash('sha256').update(req.params.token).digest('hex');

    const farmer = await FarmerModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() }
    });

    if (!farmer) {
        return next(new AppError('Token has expired. Please try again later', 400));
    }
    if (req.body.password !== req.body.passwordConfirm) {
        return next(new AppError('Passwords do not match', 400));
    }


    farmer.password = req.body.password;
    farmer.passwordConfirm = req.body.passwordConfirm;
    farmer.passwordResetToken = undefined;
    farmer.passwordResetTokenExpires = undefined;
    console.log('Before save:', farmer.password);
    await farmer.save();
    console.log('After save:', farmer.password);


    sendToken(farmer, 201, res);
}

exports.startSignup = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(new AppError('Email is required', 400));
        }

        let farmer = await FarmerModel.findOne({ email });

        if (farmer) {
            return next(new AppError('Email already registered', 400));
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpHash = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        if (!farmer) {
            farmer = await FarmerModel.create({
                email,
                registerOtp: otpHash,
                registerOtpExpires: Date.now() + 10 * 60 * 1000
            });
        } else {
            farmer.registerOtp = otpHash;
            farmer.registerOtpExpires = Date.now() + 10 * 60 * 1000;
            await farmer.save({ validateBeforeSave: false });
        }

        await sendVerifyEmail(email, otp);

        res.status(200).json({
            status: 'success',
            message: 'Verification code sent'
        });
    } catch (err) {
        console.log(err);

    }
};

exports.verifyEmail = async (req, res, next) => {
    const { email, otp } = req.body;

    const farmer = await FarmerModel.findOne({
        email,
        registerOtpExpires: { $gt: Date.now() }
    });

    if (!farmer) {
        return next(new AppError('OTP expired or invalid', 400));
    }

    const otpHash = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    if (otpHash !== farmer.registerOtp) {
        return next(new AppError('Incorrect verification code', 400));
    }

    farmer.isEmailVerified = true;
    farmer.registerOtp = undefined;
    farmer.registerOtpExpires = undefined;

    await farmer.save({ validateBeforeSave: false });

    // temporary signup token
    sendToken(farmer, 201, res);
};

exports.completeSignup = async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }
    if (!token) {
        return next(new AppError('Signup token missing', 401));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const farmer = await FarmerModel.findById(decoded.id);

    if (!farmer || !farmer.isEmailVerified) {
        return next(new AppError('Email not verified. Please verify email first', 401));
    }

    const {
        name,
        phone_number,
        village,
        district,
        preferredLanguage,
        preferredCrops,
        notificationPreference,
        password,
        passwordConfirm,
        latitude,    // ✅ Receive from frontend
        longitude    // ✅ Receive from frontend
    } = req.body;

    // Validation
    if (!latitude || !longitude) {
        return next(new AppError('Location is required', 400));
    }

    // Create farmer with GeoJSON location

    farmer.name = name;
    farmer.phone_number = phone_number;
    farmer.village = village;
    farmer.district = district;
    farmer.preferredLanguage = preferredLanguage;
    farmer.preferredCrops = preferredCrops;
    farmer.notificationPreference = notificationPreference;
    farmer.password = password;
    farmer.passwordConfirm = passwordConfirm;
    farmer.location = {
        type: "Point",
        coordinates: [
            parseFloat(longitude),
            parseFloat(latitude)
        ]
    };

    farmer.signupCompleted = true;

    await farmer.save();
    sendToken(farmer, 201, res);
};

exports.googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email } = payload;

        let farmer = await FarmerModel.findOne({ email: email });

        if (!farmer) {
            return next(new AppError('This email is not registered. Complete signup', 404))
        }

        await sendToken(farmer, 200, res);

    } catch (err) {
        return next(new AppError(err?.message || 'Google Login failed', 400));
    }

}

exports.logout = async (req, res, next) => {
    res.clearCookie('token');
    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
}

