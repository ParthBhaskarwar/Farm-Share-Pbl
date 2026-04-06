function calculateRenterTrust(stats){
  const bookingScore = Math.max(0, Math.min(100,
    (stats.bookingStats.onTimeReturns /
      Math.max(1, stats.bookingStats.totalBookings)) * 100
    - stats.bookingStats.lateReturns * 10
    - stats.bookingStats.noShows * 25
  ));

  const damage =
    stats.equipmentHandling.avgPreRentalHealth -
    stats.equipmentHandling.avgPostRentalHealth;

  const handlingScore =
    damage <= 5 ? 100 : Math.max(0, 100 - damage * 2);

  const creditScoreMap = {
    EXCELLENT: 100,
    GOOD: 85,
    AVERAGE: 65,
    POOR: 40
  };

  const creditScore =
    stats.creditReliability.verified
      ? creditScoreMap[stats.creditReliability.creditRange]
      : 50;

  const ratingScore =
    (stats.ratings.avgOwnerRating / 5) * 100;

  const verificationScore =
    stats.verification.isVerified ? 100 : 40;

  return Math.round(
    bookingScore * 0.40 +
    handlingScore * 0.30 +
    creditScore * 0.15 +
    ratingScore * 0.10 +
    verificationScore * 0.05
  );
}

module.exports=calculateRenterTrust;
