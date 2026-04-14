const Booking = require("../models/BookingModel");
const AppError = require('./../AppError');
const crypto = require("crypto");
const razorpay = require("./../razorpay");
const Farmer = require('./../models/FarmerModel');
const BookingModel = require("../models/BookingModel");
const { sendVerifyPickup, sendVerifyReturn ,sendBookingConfirmation,sendRentalJob} = require('./../mailService');
const uploadBuffer = require('./../uploadToCloudinary');
const FarmerEquipmentModel = require("../models/FarmerEquipmentModel");
const calculatePrice = require('./../utils/priceEngine');
const HealthScore = require('./../models/HealthScoreModel');
const EquipmentCatalogModel = require('./../models/EquipmentCatalogModel');

async function getTotalUnitsOfEquipment(equipment) {
    return await FarmerEquipmentModel.countDocuments({
        equipment: equipment.equipment
    });
};

async function getTotalBookings(equipmentId) {
    return await Booking.countDocuments({
        equipment: equipmentId,
        bookingStatus: { $ne: 'cancelled' }
    });
};

exports.getBookedSlots = async (req, res, next) => {
    try {
        const { date } = req.query; // format 'YYYY-MM-DD'
        const equipmentId = req.params.id;

        if (!date || !equipmentId) {
            return res.status(400).json({ message: "Date and equipment ID are required" });
        }

        const startOfDay = new Date(`${date}T00:00:00`);
        const endOfDay = new Date(`${date}T23:59:59`);
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        const bookings = await Booking.find({
            equipment: equipmentId,
            $or: [
                { bookingStatus: { $in: ["confirmed", "active", "completed"] } },
                { 
                    bookingStatus: "pending", 
                    createdAt: { $gt: fifteenMinutesAgo } 
                }
            ],
            "timeSlot.startTime": { $gte: startOfDay, $lte: endOfDay }
        }).select("timeSlot");

        res.status(200).json({
            status: "success",
            slots: bookings.map(b => b.timeSlot)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createBooking = async (req, res, next) => {
    const { startDate, startTime, endTime, duration, amount, isOperatorRequired, isTransportRequired } = req.body;
    let {process,landSize}=req.body
    const equipmentId = req.params.id;
    const farmerId = req.farmer._id;

    try {
        // Combine date + time
        const startDateTime = new Date(`${startDate}T${startTime}:00`);
        const endDateTime = new Date(`${startDate}T${endTime}:00`);

        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const conflict = await Booking.findOne({
            equipment: equipmentId,
            $or: [
                { bookingStatus: { $in: ["confirmed", "active", "completed"] } },
                { 
                    bookingStatus: "pending", 
                    createdAt: { $gt: fifteenMinutesAgo } 
                }
            ],
            "timeSlot.startTime": { $lt: endDateTime },
            "timeSlot.endTime": { $gt: startDateTime }
        });

        if (conflict) {
            return res.status(400).json({
                status: "fail",
                message: "Selected time slot is already booked"
            });
        }

        // --- PRICE SECURITY VERIFICATION ---
        const equipment = await FarmerEquipmentModel.findById(equipmentId);
        const health = await HealthScore.findOne({ equipmentId });
        const totalUnits = await getTotalUnitsOfEquipment(equipment);
        const activeBookings = await getTotalBookings(equipmentId);
        const baseCatalog = await EquipmentCatalogModel.findById(equipment.equipment);

        let workAmount = 0;
        let calculatedDuration = duration;
        
        if (isOperatorRequired && process) {
            const selectedProcess = baseCatalog.suitableProcesses.find(p => p.process === process);
            if (selectedProcess) {
                workAmount = selectedProcess.amount;
                calculatedDuration = selectedProcess.duration * (landSize || 1);
            }
        }

        if (calculatedDuration > 9) {
            return res.status(400).json({
                status: "fail",
                message: "Booking cannot be performed. Job exceeds daily 9-hour window (8 AM - 5 PM). Please reduce land size."
            });
        }

        const calculated = calculatePrice({
            baseHourlyRate: equipment.pricePerHour,
            healthScore: health?.totalScore || 80,
            purchaseYear: equipment.specs.year,
            activeBookingsForThisEquipment: activeBookings,
            totalUnitsOfThisEquipment: totalUnits,
            distanceKm: req.body.distance || 0,
            duration: calculatedDuration,
            hasOperator: equipment.includesOperator,
            hasTransport: equipment.includesTransport,
            isOperatorRequired,
            isTransportRequired,
            workAmount,
            landSize: landSize || 0
        });

        // Verify frontend amount matches backend calculation (allow small rounding tolerance)
        const priceDifference = Math.abs(Math.round(calculated.dynamicPrice) - Math.round(amount));
        if (priceDifference > 5) { // Allow up to 5 rupees difference for rounding/demand drift
            return res.status(400).json({
                status: "fail",
                message: "Price has updated. Please refresh the price breakdown and try again."
            });
        }
        // --- END PRICE SECURITY ---

        if(!isOperatorRequired){
            process=undefined;
            landSize=undefined
        }

        // Razorpay order
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // Create booking
        const booking = await Booking.create({
            startDate: startDate,
            equipment: equipmentId,
            farmer: farmerId,
            duration,
            totalAmount: amount,
            bookingStatus: "pending",
            paymentStatus: "pending",
            razorpayOrderId: order.id,
            isOperatorRequired: isOperatorRequired,
            isTransportRequired: isTransportRequired,
            timeSlot: {
                startTime: startDateTime,
                endTime: endDateTime
            },
            service:{
                process:process,
                landSize:landSize
            }
        });

        return res.status(200).json({
            status: "success",
            order,
            booking
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.verifyPayment = async (req, res, next) => {

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid payment signature'
            });
        }
        const booking = await Booking.findByIdAndUpdate(bookingId, {
            bookingStatus: "confirmed",
            paymentStatus: "paid",
        }, { new: true }).populate("farmer", "name email phone_number")
            .populate({
                path: "equipment",
                populate: [
                    {
                        path: "equipment",          
                        select: "equipmentName"
                    },
                    {
                        path: "farmer",           
                        select: "name email"
                    }
                ]
            })
            .lean();

        if (!booking) {
            return res.status(400).json({
                status: 'fail',
                message: 'Booking not found'
            })
        }

        // Calculate correct earnings (Exclude platform charge)
        const platformChargePercentage = 0.4; // 40%
        const platformCharge = booking.totalAmount * (platformChargePercentage / 1.4); // algebraic reversal of 40% markup
        const farmerEarnings = Math.floor(booking.totalAmount - platformCharge);

        await Farmer.findByIdAndUpdate(
            booking.equipment.farmer,
            { $inc: { earnings: farmerEarnings } }
        );

        await sendBookingConfirmation(booking);

        await sendRentalJob(booking);

        return res.status(200).json({
            status: 'success',
            booking
        });


    } catch (err) {
        console.log(err);
    }
}

exports.getRentals = async (req, res, next) => {

    const expiredBookings = await Booking.find({ endDate: { $lt: new Date() }, bookingStatus: 'confirmed' });

    const equipmentIds = expiredBookings.map(b => b.equipment);

    await FarmerEquipmentModel.updateMany({ _id: { $in: equipmentIds } }, { $set: { available: true } });
    const farmerId = req.farmer._id;
    const rentals = await Booking.find({ farmer: farmerId })
        .populate({
            path: 'equipment',
            select: 'equipmentName images farmer',
            populate: {
                path: 'farmer',
                select: 'name village'
            }
        })
        .lean();
    if (!rentals) {
        return next(new AppError('There are no rentals of this farmer', 400));
    }

    res.status(200).json({
        status: 'success',
        rentals
    });
}

exports.getBookings = async (req, res, next) => {

    await Booking.updateMany(
        {
            endDate: { $lt: new Date() },
            bookingStatus: 'confirmed'
        },
        { $set: { bookingStatus: 'completed' } }
    );
    const farmerId = req.farmer._id;
    const myEquipments = await FarmerEquipmentModel.find({ farmer: farmerId }).select('_id');
    const myEquipmentIds = myEquipments.map(e => e._id);
    if (!myEquipmentIds) {
        return next(new AppError('Farmer do not have equipments', 404));
    }

    const bookings = await Booking.find({ equipment: { $in: myEquipmentIds } }).populate('equipment', 'equipmentName').populate('farmer', 'name').lean();

    if (!bookings) {
        return next(new AppError('Farmer do not have any bookings', 400));
    }

    res.status(200).json({
        status: 'success',
        bookings
    });

}

exports.uploadPickupImage = async (req, res, next) => {
    // Add pickup equipment image
    if (!req.file) {
        return next(new AppError('Upload an image at time of pick up', 404));
    }

    const result = await uploadBuffer(req.file.buffer, "bookings");

    const booking = await BookingModel.findByIdAndUpdate(req.params.id,
        {
            pickupImage: {
                url: result.secure_url,
                public_id: result.public_id
            }
        },
        { new: true }).populate('farmer');


    if (!booking) {
        return next(new AppError('There is no booking associated with this equipment', 404));
    }
    //send otp email to renter
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpHash = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    booking.pickupOtp = otpHash;
    booking.pickupOtpExpiry = Date.now() + 24 * 60 * 60 * 1000;
    booking.pickupImageUploaded = true;

    await booking.save({ validateBeforeSave: false });

    await sendVerifyPickup(booking.farmer.email, otp);

    res.status(200).json({
        status: 'success',
        message: 'Verification code for pick up is sent'
    });

}

exports.uploadReturnImage = async (req, res, next) => {
    // Add return equipment image
    if (!req.file) {
        return next(new AppError('Upload an image at time of return', 404));
    }

    const result = await uploadBuffer(req.file.buffer, "bookings");

    const booking = await BookingModel.findByIdAndUpdate(req.params.id,
        {
            returnImage: {
                url: result.secure_url,
                public_id: result.public_id
            }
        },
        { new: true }).populate('farmer');

    if (!booking) {
        return next(new AppError('There is no booking associated with this equipment', 404));
    }

    //send otp email to renter
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpHash = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    booking.returnOtp = otpHash;
    booking.returnOtpExpiry = Date.now() + 24 * 60 * 60 * 1000;
    booking.returnImageUploaded = true;

    await booking.save({ validateBeforeSave: false });

    await sendVerifyReturn(booking.farmer.email, otp);

    res.status(200).json({
        status: 'success',
        message: 'Verification code for return is sent'
    });
}

exports.confirmPickup = async (req, res, next) => {
    //verfy otp

    const booking = await BookingModel.findById(req.params.id);

    if (!booking) {
        return next(new AppError('There is no booking associated with this equipment', 404));
    }

    if (!booking.pickupImageUploaded) {
        return next(new AppError('Please upload image first', 400));
    }
    if (booking.pickupConfirmed) {
        return next(new AppError('Pickup already confirmed', 400));
    }

    if (booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'completed') {
        return next(new AppError('Pickup cannot be confirmed for this booking', 400));
    }

    const otp = req.body.otp;

    if (!otp) {
        return next(new AppError('Please provide OTP', 400));
    }

    const otpHash = crypto
        .createHash('sha256')
        .update(String(otp))
        .digest('hex');

    if (otpHash !== booking.pickupOtp) {
        return next(new AppError('Incorrect Verification Code', 400));
    }

    if (booking.pickupOtpExpiry < Date.now()) {
        return next(new AppError('Verification code has expired', 400));
    }

    booking.pickupConfirmed = true;
    booking.pickupOtp = undefined;
    booking.pickupOtpExpiry = undefined;
    booking.bookingStatus = "active";
    await booking.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Pickup verification successful'
    });

}

exports.confirmReturn = async (req, res, next) => {

    const booking = await BookingModel.findById(req.params.id);

    if (!booking) {
        return next(new AppError('There is no booking associated with this equipment', 404));
    }

    if (!booking.pickupConfirmed) {
        return next(new AppError('Pickup is not confirmed', 400));
    }
    if (!booking.returnImageUploaded) {
        return next(new AppError('Please upload image first', 400));
    }

    if (booking.returnConfirmed) {
        return next(new AppError('Return already confirmed', 400));
    }

    if (booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'completed') {
        return next(new AppError('Return cannot be confirmed for this booking', 400));
    }

    const otp = req.body.returnOtp;

    if (!otp) {
        return next(new AppError('Please provide OTP', 400));
    }

    const otpHash = crypto
        .createHash('sha256')
        .update(String(otp))
        .digest('hex');

    if (otpHash !== booking.returnOtp) {
        return next(new AppError('Incorrect Verification Code', 400));
    }

    if (booking.returnOtpExpiry < Date.now()) {
        return next(new AppError('Verification code has expired', 400));
    }

    booking.returnConfirmed = true;
    booking.returnOtp = undefined;
    booking.returnOtpExpiry = undefined;
    booking.bookingStatus = "completed";
    await booking.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Return verification successful'
    });
}
