import React from 'react';
import { Wrench, Clock, CheckCircle } from 'lucide-react';

const HealthCard = ({ health }) => {
  const getConditionColor = (condition) => {
    switch(condition) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Fair': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <Wrench className="w-5 h-5 text-green-600" />
          <span>Equipment Health</span>
        </h3>
        <span className={`px-4 py-1 rounded-full font-semibold ${getConditionColor(health.condition)}`}>
          {health.condition}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Usage Hours */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">Usage Hours</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">{health.usageHours}</span>
        </div>

        {/* Last Service */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">Last Service</span>
          </div>
          <span className="text-lg font-semibold text-slate-800">{health.lastService}</span>
        </div>

        {/* Next Service */}
        <div className="col-span-2 bg-white/60 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Next Service Due</span>
            <span className="text-lg font-semibold text-green-600">{health.nextService}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;