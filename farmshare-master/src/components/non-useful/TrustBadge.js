import React from 'react';
import { BadgeCheck, Star } from 'lucide-react';

const TrustBadge = ({ score, size = 'md' }) => {
  const getColor = () => {
    if (score >= 4.5) return 'from-green-600 to-emerald-500';
    if (score >= 4.0) return 'from-blue-600 to-cyan-500';
    if (score >= 3.5) return 'from-yellow-600 to-orange-500';
    return 'from-orange-600 to-red-500';
  };

  const getSize = () => {
    switch(size) {
      case 'sm': return 'px-2 py-0.5 text-xs';
      case 'lg': return 'px-4 py-2 text-base';
      default: return 'px-3 py-1 text-sm';
    }
  };

  const getIconSize = () => {
    switch(size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-5 h-5';
      default: return 'w-4 h-4';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 bg-gradient-to-r ${getColor()} ${getSize()} rounded-full shadow-lg`}>
      <BadgeCheck className={`${getIconSize()} text-white`} />
      <span className="text-white font-semibold">{score}</span>
      <Star className={`${getIconSize()} text-white fill-white`} />
    </div>
  );
};

export default TrustBadge;