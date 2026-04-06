import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, Wrench, BadgeCheck, Star, User, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import { showError } from '../../utils/toast';
import { useEffect } from 'react';

const EnhancedEquipmentCard = ({ equipment = {} ,id }) => {
  const navigate = useNavigate();
  const [avgRating,setAvgRating]=useState(0);
  
   useEffect(() => {
      const fetchAvgRating = async () => {
        try {
          const response = await api.get(`/api/equipment/rating/${id}`);
          console.log(response.data.avgRating);
          setAvgRating(response.data.avgRating);
        } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
        }
      };
      fetchAvgRating();
    }, []);

      if (!equipment) return null;


  const getHealthColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-700 border-green-300';
      case 'Good': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Fair': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-red-100 text-red-700 border-red-300';
    }
  };

 
  

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={equipment.images?.[0]?.url || '/placeholder-tractor.jpg'}
          alt={equipment.equipmentName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Trust Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-1 rounded-full shadow-lg">
            <BadgeCheck className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">{avgRating || 0}</span>
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
        </div>

        {/* Distance Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <div className="inline-flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-white" />
            <span className="text-white font-semibold text-sm">{equipment.distance?.toFixed(1) || 0}km</span>
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
            {equipment.equipmentName}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              {equipment.equipmentType}
            </span>
            <span className="text-slate-500 text-sm">{equipment.farmer?.name}</span>
          </div>
        </div>

        {/* Info Grid - Health, Insurance */}
        <div className="grid grid-cols-2 gap-2">
          {/* Equipment Health */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getHealthColor(equipment.condition)}`}>
            <Wrench className="w-4 h-4" />
            <span className="text-xs font-semibold">{equipment.condition || 'Unknown'}</span>
          </div>

          {/* Insurance Badge */}
          {equipment.hasInsurance && (
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border bg-blue-50 text-blue-700 border-blue-300">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-semibold">Insured</span>
            </div>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center space-x-2 py-2 border-t border-slate-200">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {equipment.farmer?.name?.charAt(0) || 'F'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">{equipment.farmer?.name}</p>
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Equipment Owner</span>
            </div>
          </div>
        </div>

        {/* Dynamic Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-green-600">₹{equipment.dynamicPrice || equipment.pricePerDay}</span>
            <span className="text-slate-600">/day</span>
          </div>
          <button 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            onClick={() => navigate(`/equipment/${equipment._id}`)}
          >
            <span>View</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEquipmentCard;