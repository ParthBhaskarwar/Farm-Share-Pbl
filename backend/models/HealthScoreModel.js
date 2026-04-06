const mongoose = require('mongoose');


const InspectionSchema = new mongoose.Schema({
    parameter: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    }
}, { _id: false });

const HealthScoreSchema = new mongoose.Schema({
    equipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FarmerEquipment",
        required: true
    },

    equipmentCategory: {
        type: String,
        enum: ["SELF_POWERED", "TRACTOR_DRIVEN", "NON_POWERED", "UTILITY"],
        required: true
    },

    inspections: {
        type: [InspectionSchema],
        required: true
    },

    totalScore: {
        type: Number,
        required: true
    },

    verifiedBy: {
        type: String,
        default: "SYSTEM"
    },

    verifiedAt: {
        type: Date,
        default: Date.now
    },

    comments:{
        type:[String],
        require:true
    }
});

const HealthScore = mongoose.model('HealthScore', HealthScoreSchema);

module.exports = HealthScore;