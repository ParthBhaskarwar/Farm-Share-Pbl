import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EquipmentComboCard from '../components/Combos/EquipmentComboCard';
import  mockCombos  from '../components/Combos/mockCombos';
import { Sparkles, TrendingUp,ArrowLeft } from 'lucide-react';


const CombosListing = () => {
  
const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState('all');

  const crops = ['all', 'Rice', 'Wheat', 'Cotton'];

  const filteredCombos = selectedCrop === 'all' 
    ? mockCombos 
    : mockCombos.filter(combo => combo.crop === selectedCrop);

  return (
    <>
    
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
      
      <div className="max-w-7xl mx-auto">
        <button
        onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-600 hover:text-green-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Search</span>
        </button>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
              Equipment Combos
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-lg text-slate-600 mb-4">
            Save time and money with pre-configured equipment packages
          </p>
          
          {/* Benefit Banner */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            <TrendingUp className="w-5 h-5" />
            <span>Save up to ₹300 with combo bookings</span>
          </div>
        </div>

        {/* Crop Filter */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-4 mb-8 border border-white/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Filter by Crop:</h3>
            <div className="flex gap-3">
              {crops.map(crop => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                    selectedCrop === crop
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {crop === 'all' ? 'All Crops' : crop}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Combos Grid */}
        {filteredCombos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-slate-600">No combos found for {selectedCrop}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCombos.map(combo => (
              <EquipmentComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CombosListing;