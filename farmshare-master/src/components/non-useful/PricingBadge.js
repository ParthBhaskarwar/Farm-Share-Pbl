import React from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

const PricingBadge = ({ dynamicPrice }) => {
  const { current, base, discount, reason } = dynamicPrice;
  const isDiscount = discount > 0;
  const isIncrease = discount < 0;

  return (
    <div className="space-y-3">
      {/* Price Display */}
      <div className="flex items-baseline space-x-3">
        <span className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
          ₹{current}
        </span>
        <span className="text-slate-600 font-medium">/day</span>
        {discount !== 0 && (
          <span className="text-xl text-slate-400 line-through">₹{base}</span>
        )}
      </div>

      {/* Dynamic Pricing Indicator */}
      {discount !== 0 && (
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
          isDiscount 
            ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white' 
            : 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
        }`}>
          {isDiscount ? (
            <TrendingDown className="w-5 h-5" />
          ) : (
            <TrendingUp className="w-5 h-5" />
          )}
          <span>{Math.abs(discount)}% {isDiscount ? 'OFF' : 'HIGHER'}</span>
          <span className="mx-1">•</span>
          <Zap className="w-4 h-4" />
          <span>{reason}</span>
        </div>
      )}

      {/* Savings Display */}
      {isDiscount && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-sm text-green-700 font-semibold">
            💰 You save ₹{base - current} with this booking!
          </p>
        </div>
      )}
    </div>
  );
};

export default PricingBadge;