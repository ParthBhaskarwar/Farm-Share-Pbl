import React, { useState } from 'react';
import { X } from 'lucide-react';

const HorizontalFiltersBar = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  resultCount,
  searchParams
}) => {
  const sortOptions = [
    { value: 'distance', label: 'Nearest First', icon: '📍' },
    { value: 'price-low', label: 'Cheapest First', icon: '💰' },
    { value: 'price-high', label: 'Most Expensive', icon: '💎' },
    { value: 'rating', label: 'Highest Rated', icon: '⭐' }
  ];

  const handleConditionToggle = (condition) => {
    const newConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter(c => c !== condition)
      : [...filters.conditions, condition];
    setFilters({ ...filters, conditions: newConditions });
  };

  const hasActiveFilters =
    filters.maxDistance !== 20 ||
    filters.insuranceOnly ||
    filters.conditions.length < 3 ||
    filters.priceRange[0] !== 100 ||
    filters.priceRange[1] !== 2000;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
      {/* Top Row: Results + Sort */}
      <div className="flex items-center justify-between mb-4">
        {/* Results Count */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {resultCount} {resultCount === 1 ? 'Result' : 'Results'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {searchParams.location && `Near your location`}
            {searchParams.crop && ` • ${searchParams.crop}`}
            {searchParams.process && ` • ${searchParams.process}`}
            {searchParams.equipment && ` • "${searchParams.equipment}"`}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-green-50 border border-green-200 text-green-700 px-4 py-2 pr-10 rounded-xl font-semibold hover:bg-green-100 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Quick Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Distance Quick Select */}
        <div className="bg-slate-50 rounded-xl p-3">
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            📍 Distance
          </label>
          <select
            value={filters.maxDistance}
            onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value={5}>Within 5km</option>
            <option value={10}>Within 10km</option>
            <option value={20}>Within 20km</option>
            <option value={50}>Within 50km</option>
          </select>
        </div>

        {/* Price Quick Select */}
        <div className="bg-slate-50 rounded-xl p-3">
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            💰 Price Range
          </label>
          <select
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              setFilters({ ...filters, priceRange: [min, max] });
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="100-2000">All Prices</option>
            <option value="100-500">Under ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-20000">Above ₹1000</option>
          </select>
        </div>

        {/* Condition Quick Select */}
        <div className="bg-slate-50 rounded-xl p-3">
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            ✅ Condition
          </label>
          <select
            value={filters.conditions.length === 3 ? 'all' : filters.conditions[0] || 'all'}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all') {
                setFilters({ ...filters, conditions: ['Excellent', 'Good', 'Fair'] });
              } else {
                setFilters({ ...filters, conditions: [value] });
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Conditions</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        {/* Insurance Toggle */}
        <div className="bg-slate-50 rounded-xl p-3">
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            🛡️ Insurance
          </label>
          <button
            onClick={() => setFilters({ ...filters, insuranceOnly: !filters.insuranceOnly })}
            className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all ${filters.insuranceOnly
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
              }`}
          >
            {filters.insuranceOnly ? 'Insured Only ✓' : 'All Equipment'}
          </button>
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200">
          <span className="text-sm font-semibold text-slate-600">Active:</span>

          {filters.maxDistance !== 20 && (
            <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-300 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              <span>📍 {filters.maxDistance}km</span>
              <button
                onClick={() => setFilters({ ...filters, maxDistance: 20 })}
                className="hover:bg-blue-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {(filters.priceRange[0] !== 100 || filters.priceRange[1] !== 2000) && (
            <div className="inline-flex items-center space-x-2 bg-purple-100 border border-purple-300 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              <span>💰 ₹{filters.priceRange[0]}-₹{filters.priceRange[1]}</span>
              <button
                onClick={() => setFilters({ ...filters, priceRange: [100, 2000] })}
                className="hover:bg-purple-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.insuranceOnly && (
            <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-300 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              <span>🛡️ Insured</span>
              <button
                onClick={() => setFilters({ ...filters, insuranceOnly: false })}
                className="hover:bg-blue-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.conditions.length < 3 && filters.conditions.map(condition => (
            <div key={condition} className="inline-flex items-center space-x-2 bg-green-100 border border-green-300 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              <span>{condition}</span>
              <button
                onClick={() => handleConditionToggle(condition)}
                className="hover:bg-green-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <button
            onClick={() => setFilters({
              maxDistance: 20,
              priceRange: [100, 2000],
              conditions: ['Excellent', 'Good', 'Fair'],
              insuranceOnly: false
            })}
            className="ml-auto text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default HorizontalFiltersBar;