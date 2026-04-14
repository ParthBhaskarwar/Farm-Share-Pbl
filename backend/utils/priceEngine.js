module.exports = function calculatePrice({
    baseHourlyRate,
    healthScore,
    purchaseYear,
    activeBookingsForThisEquipment,
    totalUnitsOfThisEquipment,
    distanceKm,
    duration,
    hasOperator,
    hasTransport,
    isOperatorRequired,
    isTransportRequired,
    workAmount,
    landSize
}) {

    const healthMultiplier =
        healthScore >= 90 ? 1 :
            healthScore >= 75 ? 0.9 :
                healthScore >= 60 ? 0.8 : 0.65;

    const yearsUsed = new Date().getFullYear() - purchaseYear;
    const ageMultiplier =
        yearsUsed <= 2 ? 1 :
            yearsUsed <= 5 ? 0.85 :
                yearsUsed <= 8 ? 0.7 : 0.55;

    let demandMultiplier;
    let availabilityRatio =
        activeBookingsForThisEquipment /
        totalUnitsOfThisEquipment
    if (availabilityRatio >= 0.8) { demandMultiplier = 1.25; }
    else if (availabilityRatio >= 0.5) { demandMultiplier = 1.1; }
    else { demandMultiplier = 1.0; }

    const dynamicBase =
        baseHourlyRate *
        healthMultiplier *
        ageMultiplier *
        demandMultiplier;

    let deliveryCharge = 0;
    deliveryCharge = hasTransport && isTransportRequired ? Math.round(distanceKm * 20) : 0;

    let operatorCharge = 0;
    operatorCharge = hasOperator && isOperatorRequired ? workAmount * landSize : 0;

    const basePrice = Math.round(dynamicBase * duration);

    const platformCharge = basePrice * 0.05;

    const dynamicPrice = Math.round(
        basePrice +
        deliveryCharge +
        operatorCharge +
        platformCharge
    );

    return { basePrice, deliveryCharge, operatorCharge, dynamicPrice, platformCharge, dynamicBase };
};
