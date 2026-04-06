import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield, User, Wrench } from 'lucide-react';

const EquipmentHero = ({ equipment }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % equipment.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + equipment.images.length) % equipment.images.length);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 overflow-hidden shadow-2xl mb-8">
      <div className="grid lg:grid-cols-2 gap-8 p-8">
        {/* LEFT - Image Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <img
              src={equipment.images[currentImage].url}
              alt={equipment.equipment.equipmentName}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {equipment.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
              {currentImage + 1} / {equipment.images.length}
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            {/* Title */}
            <h3 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Services Included</span>
            </h3>
            <div className="space-y-2">
              {/* Operator Included */}
              {equipment.includesOperator && (
                <div className="flex items-center space-x-2 text-slate-700">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Operator Available</span>
                </div>
              )}
              {/* Insurance Included */}       
              {equipment.hasInsurance && (
                <div className="flex items-center space-x-2 text-slate-700">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Insurance Covered</span>
                </div>
              )}
              {/* No services */}
              {!equipment.includesOperator && !equipment.hasInsurance && (
                <p className="text-sm text-slate-500">No additional services included</p>
              )}
            </div>
          </div>
          {/* Thumbnail Gallery */}
          {/* <div className="flex space-x-3">
            {equipment.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`flex-1 h-24 rounded-xl overflow-hidden border-2 transition-all ${currentImage === index ? 'border-green-600 scale-105' : 'border-white/40 opacity-60 hover:opacity-100'
                  }`}
              >
                <img src={img.url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div> */}
        </div>

        {/* RIGHT - Equipment Info */}
        <div className="flex flex-col space-y-6">
          {/* Title & Category */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                {equipment.equipment.equipmentType}
              </span>
              {equipment.specs?.year && ( 
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-600">{equipment.specs.year}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">{equipment.equipment.equipmentName}</h1>
            <p className="text-lg text-slate-600">{equipment.equipment.description}</p>
          </div>
          {/* Suitable For Section */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            {/* Title */}
            <h3 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
              <span className="text-lg">🌾</span>
              <span>Suitable For</span>
            </h3>
            {/* Suitable Crops */}
            {equipment.equipment.suitableCrops && equipment.equipment.suitableCrops.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="text-sm font-semibold text-slate-600">Crops:</p>
                  {equipment.equipment.suitableCrops.map((crop, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Suitable Processes */}
            {equipment.equipment.suitableProcesses && equipment.equipment.suitableProcesses.length > 0 && (
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <p className="text-sm font-semibold text-slate-600">Processes:</p>
                  {equipment.equipment.suitableProcesses.map((process, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {process.process}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Features Section */}
          {equipment.equipment.features && equipment.equipment.features.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-purple-600" />
                <span>Key Features</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {equipment.equipment.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Services Included */}
          
        </div>
      </div>
    </div>
  );
};

export default EquipmentHero;