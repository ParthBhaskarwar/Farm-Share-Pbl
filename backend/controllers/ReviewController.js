const FarmerReview = require('./../models/FarmerReviewModel');
const EquipmentReview = require('./../models/EquipmentReviewModel');
const mongoose = require('mongoose');


exports.makeEquipmentReview = async (req, res, next) => {
    try {

        const id = req.params.id;
        const {
            rating,
            comment,
            tags,
        } = req.body;

        const existing = await EquipmentReview.findOne({
            ReviewerFarmer: req.farmer._id,
            equipment: id
        });

        if (existing) {
            return res.status(400).json({ message: 'You already reviewed this equipment' });
        }


        const review = await EquipmentReview.create({
            ReviewerFarmer: req.farmer._id,
            equipment: id,
            rating,
            comment,
            tags,
        });

        res.status(200).json({
            status: 'success',
            review
        })
    } catch (err) {
        console.log(err);
    }
};


exports.makeFarmerReview = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const { rating, comment, tags } = req.body;

        if (farmerId.toString() === req.farmer._id.toString()) {
            return res.status(400).json({
                status: 'fail',
                message: "You can't review yourself"
            });
        }

        const existing = await FarmerReview.findOne({
            ReviewerFarmer: req.farmer._id,
            farmer: farmerId
        });

        if (existing) {
            return res.status(400).json({
                status: 'fail',
                message: 'You already reviewed this farmer'
            });
        }

        const review = await FarmerReview.create({
            ReviewerFarmer: req.farmer._id,
            farmer: farmerId,
            rating,
            comment,
            tags
        });

        res.status(201).json({
            status: 'success',
            review
        });

    } catch (err) {
        console.error('❌ makeFarmerReview error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};



exports.getFarmerReviews = async (req, res) => {
    try {
        const farmerId = req.params.farmerId;

        const reviews = await FarmerReview.find({ farmer: farmerId })
            .populate('ReviewerFarmer', 'name village photo trustScore')
            .lean();

        res.status(200).json({
            status: 'success',
            reviews
        });
    } catch (err) {
        console.error(err);
    }
};


exports.getEquipmentReviews = async (req, res, next) => {
    try {
        const id = req.params.id
        const reviews = await EquipmentReview.find({ equipment: id }).populate('ReviewerFarmer', 'name village photo trustScore').lean();
        res.status(200).json({
            status: 'success',
            reviews
        });
    } catch (err) {
        console.log(err);
    }
}