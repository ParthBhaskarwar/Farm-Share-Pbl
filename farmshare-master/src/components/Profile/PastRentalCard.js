import React from 'react';
import { Calendar, User, MapPin, Star, Tractor } from 'lucide-react';

const PastRentalCard = ({ 
  rental, 
  onReviewFarmer, 
  onReviewEquipment 
}) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-300';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'upcoming': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="p-5 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              {rental.equipment.equipmentName}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{rental.equipment?.farmer.village}</span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(rental.bookingStatus)}`}>
            {rental.bookingStatus.charAt(0).toUpperCase() + rental.bookingStatus.slice(1)}
          </div>
        </div>

        {/* Equipment Image */}
        {rental.equipment.image && (
          <div className="h-32 rounded-xl overflow-hidden">
            <img
              src={rental.equipment.image}
              alt={rental.equipment.equipmentName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Owner Info */}
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
            {rental.equipment?.farmer.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">{rental.equipment.farmer?.name}</p>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <User className="w-3 h-3" />
              <span>Equipment Owner</span>
            </div>
          </div>
        </div>

        {/* Booking Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-slate-600 font-medium">Start Date</span>
            </div>
            <p className="text-sm font-bold text-blue-600">{rental.startDate}</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-slate-600 font-medium">End Date</span>
            </div>
            <p className="text-sm font-bold text-purple-600">{rental.endDate}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-slate-600">Total Amount</span>
          <span className="text-2xl font-bold text-green-600">
            ₹{rental.totalAmount}
          </span>
        </div>

        {/* 🔥 Review Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={() => onReviewFarmer?.(rental)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-green-300 bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition"
          >
            <Star className="w-4 h-4" />
            Review Farmer
          </button>

          <button
            onClick={() => onReviewEquipment?.(rental)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-blue-300 bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
          >
            <Tractor className="w-4 h-4" />
            Review Equipment
          </button>
        </div>

      </div>
    </div>
  );
};

export default PastRentalCard;
