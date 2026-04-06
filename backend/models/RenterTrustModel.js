const mongoose =require('mongoose');

const renterTrustSchema = new mongoose.Schema({
  renterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true
  },

  /* 1. Booking Behavior (40%) */
  bookingStats: {
    totalBookings: { type: Number, default: 0 },
    onTimeReturns: { type: Number, default: 0 },
    lateReturns: { type: Number, default: 0 },
    noShows: { type: Number, default: 0 }
  },

  /* 2. Equipment Handling (30%) */
  equipmentHandling: {
    avgPreRentalHealth: { type: Number, default: 100 },
    avgPostRentalHealth: { type: Number, default: 95 }
  },

  /* 3. Credit Reliability – KCC Proxy (15%) */
  creditReliability: {
    source: {
      type: String,
      enum: ["KCC_DECLARED", "BANK_CERT", "NONE"],
      default: "NONE"
    },
    creditRange: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "AVERAGE", "POOR"],
      default: "AVERAGE"
    },
    verified: {
      type: Boolean,
      default: false
    }
  },

  /* 4. Owner Ratings (10%) */
  ratings: {
    avgOwnerRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4
    }
  },

  /* 5. Platform Verification (5%) */
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    }
  },

  /* Final Calculated Trust Score */
  trustScore: {
    type: Number,
    default: 50
  }

}, { timestamps: true });

const RenterTrust= new mongoose.model("RenterTrust", renterTrustSchema);

module.exports=RenterTrust;
