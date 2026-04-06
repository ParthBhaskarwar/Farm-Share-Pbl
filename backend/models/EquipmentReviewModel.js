const mongoose = require('mongoose');

const EquipmentReviewSchema = new mongoose.Schema({
    ReviewerFarmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },

    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FarmerEquipment',
        required: true
    },

    rating: {
        type: Number,
        max: 5,
        required: true
    },

    comment: {
        type: String,
        trim: true,
        maxlength: 500,
        required: true
    },
    tags: {
        type: [String],
        enum: ["Well Maintained",
            "Clean",
            "Smooth",
            "Fuel Efficient",
            "Old",
            "Breakdown",
            "Poor Condition",
            "Worth Price",
            "Overpriced"],
        required: true
    },
    
},
 { timestamps: true }
);

module.exports = mongoose.model("EquipmentReview", EquipmentReviewSchema);