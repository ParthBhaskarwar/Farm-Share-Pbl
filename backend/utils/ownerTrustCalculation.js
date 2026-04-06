function calculateOwnerTrust(stats) {

  /* 1. Equipment Accuracy (30%) */
  const accuracyScore = Math.max(
    0,
    100 - (stats.equipmentAccuracy.mismatchCount * 15)
  );

  /* 2. Equipment Reliability (25%) */
  const reliabilityScore = Math.max(0, Math.min(100,
    100 - (
      stats.reliabilityStats.breakdowns /
      Math.max(1, stats.reliabilityStats.totalRentals)
    ) * 100
  ));

  /* 3. Maintenance Discipline (20%) */
  const maintenanceScore = Math.min(100,
    (stats.maintenanceStats.completedServices /
      Math.max(1, stats.maintenanceStats.scheduledServices)) * 100
  );

  /* 4. Owner Behaviour (15%) */
  const behaviorScore = Math.min(100,
    stats.behaviorStats.deliveryOnTimePercent * 0.7 +
    stats.behaviorStats.supportRating * 0.3
  );

  /* 5. Renter Ratings (10%) */
  const ratingScore =
    (stats.ratings.avgRenterRating / 5) * 100;

  /* Final Weighted Owner Trust Score */
  return Math.round(
    accuracyScore * 0.30 +
    reliabilityScore * 0.25 +
    maintenanceScore * 0.20 +
    behaviorScore * 0.15 +
    ratingScore * 0.10
  );
}

module.exports=calculateOwnerTrust;