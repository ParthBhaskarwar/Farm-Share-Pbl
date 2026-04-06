import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Shield, Users, TrendingDown } from 'lucide-react';

const EquipmentComboCard = ({ combo }) => {
  const navigate = useNavigate();

  const handleViewCombo = () => {
    navigate(`/combos/${combo.id}`);
  };

  const handleBookNow = () => {
    alert(`Booking combo: ${combo.crop} - ${combo.process}\nTotal: ₹${combo.price.combo}`);
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border border-white/30">
      {/* Recommended Badge */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 flex items-center justify-center">
        <Star className="w-4 h-4 text-white mr-2 fill-white" />
        <span className="text-white font-bold text-sm">Recommended Combo</span>
      </div>

      <div className="p-6">
        {/* Crop + Process Header */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-3xl">{combo.cropIcon}</span>
            <h3 className="text-2xl font-bold text-slate-800">
              {combo.crop} • {combo.process}
            </h3>
          </div>
          
          {/* Benefit Line */}
          <div className="flex items-center space-x-2 text-green-600 font-semibold">
            <TrendingDown className="w-4 h-4" />
            <span>Saves ₹{combo.price.savings} • {combo.benefit}</span>
          </div>
        </div>

        {/* Equipment Stack List */}
        <div className="bg-white/40 rounded-xl p-4 mb-4 space-y-3">
          <h4 className="text-sm font-bold text-slate-700 mb-3">Equipment Included:</h4>
          {combo.equipments.map((equipment, index) => (
            <div key={index} className="flex items-center justify-between bg-white/60 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{equipment.icon}</span>
                <div>
                  <p className="font-bold text-slate-800">{equipment.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      equipment.available 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {equipment.available ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                      {equipment.condition}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Duration & Distance */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="font-semibold">Duration:</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
              {combo.duration}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-slate-600">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{combo.distance}km away</span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 mb-4 border-2 border-green-200">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-slate-600 mb-1">Combo Price</p>
              <p className="text-3xl font-bold text-green-600">₹{combo.price.combo}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 line-through">₹{combo.price.individual}</p>
              <p className="text-sm font-bold text-green-600">Save ₹{combo.price.savings}</p>
            </div>
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-semibold">Individual price: ₹{combo.price.individual}</span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-slate-800">{combo.rating}</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">{combo.usageCount} bookings</span>
          </div>
          {combo.insuranceIncluded && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">Insured</span>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleViewCombo}
            className="flex-1 px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl font-bold hover:bg-green-50 transition-colors"
          >
            View Combo
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentComboCard;