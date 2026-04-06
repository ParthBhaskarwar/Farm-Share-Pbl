import React from 'react';
import { Tractor, Sprout, Droplets, Sun } from 'lucide-react';

const CropTimeline = ({ stages }) => {
  const getIcon = (index) => {
    const icons = [Tractor, Sprout, Droplets, Sun];
    const IconComponent = icons[index % icons.length];
    return IconComponent;
  };

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const IconComponent = getIcon(index);
        return (
          <div key={index} className="relative pl-8">
            {/* Icon */}
            <div className="absolute left-0 top-0 bg-gradient-to-br from-green-600 to-emerald-500 p-2 rounded-xl shadow-lg">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            
            {/* Vertical Line */}
            {index < stages.length - 1 && (
              <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-emerald-300"></div>
            )}
            
            {/* Stage Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 ml-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800">{stage.name}</h4>
                <span className="text-sm text-slate-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                  {stage.month}
                </span>
              </div>
              
              {/* Description */}
              {stage.description && (
                <p className="text-sm text-slate-600 mb-3">{stage.description}</p>
              )}
              
              {/* Equipment Tags */}
              <div className="flex flex-wrap gap-2">
                {stage.equipment.map((eq, i) => (
                  <span 
                    key={i} 
                    className="text-sm bg-gradient-to-r from-green-600 to-emerald-500 text-white px-3 py-1 rounded-lg font-medium shadow-sm"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CropTimeline;