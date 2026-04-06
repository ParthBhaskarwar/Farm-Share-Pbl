import React from 'react';
import { DollarSign, Shield, Clock, TrendingUp } from 'lucide-react';

const QuickInsights = ({ equipment }) => {
  // Calculate insights from equipment data
  const cheapestNearby = equipment
    .filter(eq => eq.distance <= 10)
    .sort((a, b) => a.price - b.price)[0];

  const highestTrust = equipment
    .sort((a, b) => b.trustScore - a.trustScore)[0];

  const availableToday = equipment
    .filter(eq => eq.available).length;

  const avgPrice = Math.round(
    equipment.reduce((sum, eq) => sum + eq.price, 0) / equipment.length
  );

  const insights = [
    {
      icon: DollarSign,
      label: 'Cheapest Nearby',
      value: cheapestNearby ? `₹${cheapestNearby.price}/day` : 'N/A',
      subtext: cheapestNearby ? `${cheapestNearby.distance}km away` : '',
      color: 'from-green-600 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Shield,
      label: 'Highest Trust',
      value: highestTrust ? `${highestTrust.trustScore}★` : 'N/A',
      subtext: highestTrust ? highestTrust.name.split(' ')[0] : '',
      color: 'from-blue-600 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Clock,
      label: 'Available Today',
      value: `${availableToday}`,
      subtext: `out of ${equipment.length}`,
      color: 'from-purple-600 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      label: 'Avg. Price',
      value: `₹${avgPrice}`,
      subtext: 'per day',
      color: 'from-orange-600 to-red-500',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {insights.map((insight, index) => {
        const IconComponent = insight.icon;
        return (
          <div
            key={index}
            className={`${insight.bgColor} rounded-2xl p-4 border border-white/40 hover:shadow-lg transition-all cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`bg-gradient-to-br ${insight.color} p-2 rounded-xl group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-600 mb-1">{insight.label}</p>
            <p className="text-2xl font-bold text-slate-800 mb-0.5">{insight.value}</p>
            {insight.subtext && (
              <p className="text-xs text-slate-500">{insight.subtext}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuickInsights;