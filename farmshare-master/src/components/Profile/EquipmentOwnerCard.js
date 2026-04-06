import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Wrench, Eye, EyeOff } from 'lucide-react';
import api from './../../api/axios';
import { showSuccess } from '../../utils/toast';

const EquipmentOwnerCard = ({ equipment }) => {
  const getHealthColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-700 border-green-300';
      case 'Good': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Fair': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const toggleAvailability = async (equipmentId) => {
    await api.patch(`/api/equipment/${equipmentId}/available`);
    window.location.reload();

  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={`${equipment.images[0].url}`}
          alt={equipment.equipmentName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {equipment.available ? (
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
              <Eye className="w-4 h-4" />
              <span>Available</span>
            </div>
          ) : (
            equipment.equipmentPublished
              ? (<div className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                <EyeOff className="w-4 h-4" />
                <span>Rented</span>
              </div>)
              : (<div className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                <EyeOff className="w-4 h-4" />
                <span>Under Inspection</span>
              </div>)
          )}
        </div>

        {/* Health Indicator */}
        <div className="absolute top-3 left-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getHealthColor(equipment.condition)}`}>
            {equipment.condition}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">{equipment.equipmentName}</h3>
          <p className="text-sm text-slate-600">{equipment.equipmentType}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Earnings This Month */}
          <div className="bg-green-50 rounded-xl p-3 border border-green-200">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-slate-600 font-medium">This Month</span>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{equipment.earningsThisMonth || 0}</p>
          </div>

          {/* Last Service */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center space-x-2 mb-1">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-slate-600 font-medium">Last Service</span>
            </div>
            <p className="text-sm font-bold text-blue-600">{equipment.lastServiceDate}</p>
          </div>
        </div>

        {/* Usage Info */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Usage Hours</span>
            <span className="font-bold text-slate-800">{equipment.specs?.hours} hrs</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-600">Next Service</span>
            <span className="font-bold text-slate-800">{equipment.nextServiceDate}</span>
          </div>
        </div>
        {/* Action Buttons */}
<div className="flex space-x-6 pt-3">
        {equipment.equipmentPublished
          ? (<>
            
            <button
              onClick={() => toggleAvailability(equipment._id)}
              className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
              {equipment.available ? 'Mark Unavailable' : 'Mark Available'}
            </button>
            </>
          )
          :
          (
            <div
              className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
              Equipment will be published after Inspection
            </div>
          )
        }
        </div>
      </div>
    </div>
  );
};

export default EquipmentOwnerCard;