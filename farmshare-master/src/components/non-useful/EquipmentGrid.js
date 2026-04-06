import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, User, Wrench, Shield, TrendingDown, TrendingUp } from 'lucide-react';

const EquipmentGrid = ({ equipment }) => {
  if (equipment.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Equipment Found</h3>
        <p className="text-slate-600 mb-6">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map(eq => (
        <EquipmentCard key={eq.id} equipment={eq} />
      ))}
    </div>
  );
};

const EquipmentCard = ({ equipment }) => {
  const navigate = useNavigate();

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${equipment.ownerPhone}`;
  };

  const handleSMS = (e) => {
    e.stopPropagation();
    const message = `Hi, I'm interested in renting your ${equipment.name}. Is it available?`;
    window.location.href = `sms:${equipment.ownerPhone}?body=${encodeURIComponent(message)}`;
  };

  const getHealthColor = (condition) => {
    switch(condition) {
      case 'Excellent': return 'bg-green-100 text-green-700 border-green-300';
      case 'Good': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Fair': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const isDiscount = equipment.dynamicPrice.discount > 0;

  return (
    <div
      onClick={() => navigate(`/equipment/${equipment.id}`)}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Trust Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-1 rounded-full shadow-lg">
            <span className="text-white font-semibold text-sm">{equipment.trustScore}</span>
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
        </div>

        {/* Distance Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <div className="inline-flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-white" />
            <span className="text-white font-semibold text-sm">{equipment.distance}km</span>
          </div>
        </div>

        {/* Availability Overlay */}
        {!equipment.available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-white text-slate-800 px-4 py-2 rounded-full font-bold shadow-lg">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Title & Category */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-green-600 transition-colors">
            {equipment.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              {equipment.category}
            </span>
            <span className="text-slate-500 text-sm">{equipment.location}</span>
          </div>
        </div>

        {/* Info Grid - Health, Insurance */}
        <div className="grid grid-cols-2 gap-2">
          {/* Equipment Health */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getHealthColor(equipment.health.condition)}`}>
            <Wrench className="w-4 h-4" />
            <span className="text-xs font-semibold">{equipment.health.condition}</span>
          </div>

          {/* Insurance Badge */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border bg-blue-50 text-blue-700 border-blue-300">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-semibold">Insured</span>
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center space-x-2 py-2 border-t border-slate-200">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {equipment.owner.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">{equipment.owner}</p>
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Farmer Owner</span>
            </div>
          </div>
        </div>

        {/* Dynamic Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-green-600">₹{equipment.price}</span>
            <span className="text-slate-600">/day</span>
            {equipment.dynamicPrice.discount !== 0 && (
              <span className="text-slate-400 line-through text-sm">₹{equipment.dynamicPrice.base}</span>
            )}
          </div>

          {/* Dynamic Price Badge */}
          {equipment.dynamicPrice.discount !== 0 && (
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
              isDiscount
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {isDiscount ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              <span>{Math.abs(equipment.dynamicPrice.discount)}% {isDiscount ? 'OFF' : 'UP'}</span>
              <span>•</span>
              <span>{equipment.dynamicPrice.reason}</span>
            </div>
          )}
        </div>

        {/* Offline Action Buttons */}
        <div className="flex space-x-2 pt-3 border-t border-slate-200">
          <button
            onClick={handleCall}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-lg">📞</span>
            <span>Call</span>
          </button>
          <button
            onClick={handleSMS}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-lg">💬</span>
            <span>SMS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentGrid;