import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, ChevronRight } from 'lucide-react';
import TrustBadge from './TrustBadge';

const EquipmentCard = ({ equipment }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <TrustBadge score={equipment.trustScore} />
        </div>
        {!equipment.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-slate-800 px-4 py-2 rounded-full font-semibold">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">{equipment.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <span className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{equipment.distance}km away</span>
            </span>
            <span className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{equipment.owner}</span>
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div>
            <span className="text-2xl font-bold text-green-600">₹{equipment.price}</span>
            <span className="text-slate-600 text-sm">/{equipment.priceUnit}</span>
          </div>
          <button onClick={() => navigate(`/equipment/${equipment.id}`)}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
            <span>View</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;