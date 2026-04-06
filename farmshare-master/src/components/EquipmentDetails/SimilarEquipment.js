import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, TrendingDown } from 'lucide-react';
import api from './../../api/axios';
import { showError, showSuccess } from "./../../utils/toast";


const SimilarEquipment = ({ currentEquipmentId, equipment }) => {
  const navigate = useNavigate();
  const [similar,setSimilar]=useState([]);

  //for fetching similar equipments
  useEffect(() => {
  const getSimilarEquipments = async () => {
    if (!equipment) return; // safety check

    try {
      const response = await api.get(`/api/equipment/${currentEquipmentId}/similarEquipments`);
      setSimilar(response.data.similarEquipments); // match backend key
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  getSimilarEquipments();
  }, [equipment]);

  if (similar.length === 0) return null;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-lg">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Similar Equipment Nearby</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {similar.map(eq => (
          <div
            key={eq._id}
            className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/40 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group">
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={eq.image}
                alt={eq.equipmentName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Distance Badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold">
                {eq.distance}km away
              </div>

              {/* Cheaper Badge */}
              {eq.pricePerDay < 700 && (
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <TrendingDown className="w-3 h-3" />
                  <span>Cheaper</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Equipment Info*/}
              <div>
                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-green-600 transition-colors">
                  {eq.equipmentName}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <MapPin className="w-3 h-3" />
                  <span>{eq.farmer.village}</span>
                </div>
              </div>

              {/* Price & Trust */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xl font-bold text-green-600">₹{eq.dynamicPrice}</span>
                  <span className="text-slate-600 text-sm">/day</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-slate-800">{eq.farmer.trustScore}</span>
                </div>
              </div>

              {/* View Button */}
              <button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
              onClick={() => navigate(`/equipment/${eq._id}`)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Net Message */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <span className="font-bold">💡 Pro Tip:</span> Can't find the perfect match? These alternatives 
          offer similar capabilities at competitive prices within your area.
        </p>
      </div>
    </div>
  );
};

export default SimilarEquipment;