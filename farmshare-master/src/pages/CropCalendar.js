import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Calendar, Leaf, Bell, ChevronRight } from 'lucide-react';
import CropTimeline from '../components/CropCalender/CropTimeline';
import { cropCalendarData } from '../components/CropCalender/mockCalenderData';

const CropCalendar = () => {
  const [selectedCrop, setSelectedCrop] = useState(cropCalendarData[0]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Crop Calendar</h1>
          <p className="text-slate-600">Plan your equipment needs based on crop stages</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Crop Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <Leaf className="w-6 h-6 text-green-600" />
                <span>Select Crop</span>
              </h2>

              <div className="space-y-3">
                {cropCalendarData.map((crop, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCrop(crop)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${selectedCrop.crop === crop.crop
                        ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg'
                        : 'bg-white/60 hover:bg-white border border-white/40'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{crop.icon}</span>
                        <div>
                          <h3 className={`font-bold ${selectedCrop.crop === crop.crop ? 'text-white' : 'text-slate-800'}`}>
                            {crop.crop}
                          </h3>
                          <p className={`text-sm ${selectedCrop.crop === crop.crop ? 'text-white/80' : 'text-slate-600'}`}>
                            {crop.stages.length} stages
                          </p>
                        </div>
                      </div>
                      {selectedCrop.crop === crop.crop && (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline View */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/40">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
                    <span className="text-4xl">{selectedCrop.icon}</span>
                    <span>{selectedCrop.crop} Growth Stages</span>
                  </h2>
                  <p className="text-slate-600 mt-2">Equipment recommendations for each stage</p>
                </div>
              </div>

              <CropTimeline stages={selectedCrop.stages} />

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-slate-200 flex space-x-4">
                <Link
                  to="/search"
                  className="flex-1 text-center bg-white border border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all"
                >
                  Book Equipment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;