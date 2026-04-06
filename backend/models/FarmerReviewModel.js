const mongoose = require('mongoose');

const FarmerReviewSchema = new mongoose.Schema({
    
    ReviewerFarmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },

    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },

    rating: {
        type: Number,
        max:5,
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
        enum: ["Polite",
            "Professional",
            "Helpful",
            "On-Time",
            
            "Late",
            "Responsive",
            "Unresponsive",
            "Trustworthy",
            "Overpriced"],
        required: true
    },

    

},
 { timestamps: true }
);

module.exports = mongoose.model("FarmerReview", FarmerReviewSchema);