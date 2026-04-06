const mongoose =require('mongoose');


const ownerTrustSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true
  },

  /* 1. Equipment Accuracy (30%) */
  equipmentAccuracy: {
    mismatchCount: { type: Number, default: 0 }
  },

  /* 2. Equipment Reliability (25%) */
  reliabilityStats: {
    totalRentals: { type: Number, default: 0 },
    breakdowns: { type: Number, default: 0 }
  },

  /* 3. Maintenance Discipline (20%) */
  maintenanceStats: {
    scheduledServices: { type: Number, default: 0 },
    completedServices: { type: Number, default: 0 }
  },

  /* 4. Owner Behaviour (15%) */
  behaviorStats: {
    deliveryOnTimePercent: { type: Number, default: 90 },
    supportRating: { type: Number, min: 0, max: 100, default: 80 }
  },

  /* 5. Renter Ratings (10%) */
  ratings: {
    avgRenterRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.2
    }
  },

  /* Final Calculated Trust Score */
  trustScore: {
    type: Number,
    default: 60
  }

}, { timestamps: true });

const OwnerTrust= new mongoose.model("OwnerTrust", ownerTrustSchema);

module.exports=OwnerTrust;
