import React, { useState } from 'react';
import { SlidersHorizontal, MapPin, DollarSign, Star, X } from 'lucide-react';

const MobileFilterBar = ({ sortBy, setSortBy, onFilterClick }) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { 
      value: 'distance', 
      label: 'Nearest First', 
      icon: MapPin,
      color: 'text-blue-600',
      activeColor: 'bg-blue-100 border-blue-300'
    },
    { 
      value: 'price-low', 
      label: 'Cheapest First', 
      icon: DollarSign,
      color: 'text-green-600',
      activeColor: 'bg-green-100 border-green-300'
    },
    { 
      value: 'rating', 
      label: 'Highest Rated', 
      icon: Star,
      color: 'text-yellow-600',
      activeColor: 'bg-yellow-100 border-yellow-300'
    }
  ];

  const activeSort = sortOptions.find(opt => opt.value === sortBy);
  const ActiveIcon = activeSort.icon;

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-slate-600">Sort by:</span>
          <div className="flex space-x-2">
            {sortOptions.map(option => {
              const Icon = option.icon;
              const isActive = sortBy === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                    isActive
                      ? `${option.activeColor} font-semibold shadow-sm`
                      : 'bg-white border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? option.color : 'text-slate-600'}`} />
                  <span className={isActive ? option.color : 'text-slate-700'}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onFilterClick}
          className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-600" />
          <span className="text-slate-700 font-medium">Filters</span>
        </button>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl z-40 safe-area-inset-bottom">
        <div className="grid grid-cols-2 gap-3 p-4">
          {/* Sort Button */}
          <button
            onClick={() => setShowSortMenu(true)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
          >
            <ActiveIcon className="w-5 h-5" />
            <span>Sort</span>
          </button>

          {/* Filter Button */}
          <button
            onClick={onFilterClick}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-green-600 text-green-600 py-4 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Mobile Sort Menu */}
      {showSortMenu && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6 space-y-4 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Sort By</h3>
              <button
                onClick={() => setShowSortMenu(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {sortOptions.map(option => {
              const Icon = option.icon;
              const isActive = sortBy === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? `${option.activeColor} font-semibold`
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white' : 'bg-slate-100'}`}>
                    <Icon className={`w-6 h-6 ${isActive ? option.color : 'text-slate-600'}`} />
                  </div>
                  <span className={`text-lg ${isActive ? option.color : 'text-slate-700'}`}>
                    {option.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterBar;