import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Shield, Users, Calendar, Phone, CheckCircle, TrendingDown } from 'lucide-react';
import  mockCombos  from '../components/Combos/mockCombos';

const ComboDetails = () => {
  const { comboId } = useParams();
  const navigate = useNavigate();
  const combo = mockCombos.find(c => c.id === comboId);

  if (!combo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Combo Not Found</h2>
          <button
            onClick={() => navigate('/combos')}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
          >
            Back to Combos
          </button>
        </div>
      </div>
    );
  }

  const handleBookCombo = () => {
    alert(`Booking Confirmed! 🎉\n\nCombo: ${combo.crop} - ${combo.process}\nTotal: ₹${combo.price.combo}\n\nRedirecting to payment...`);
  };

  // Mock calendar dates
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calendarDates = [
    { date: 22, status: 'booked' },
    { date: 23, status: 'booked' },
    { date: 24, status: 'available' },
    { date: 25, status: 'available' },
    { date: 26, status: 'booked' },
    { date: 27, status: 'available' },
    { date: 28, status: 'available' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-700 hover:text-green-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Combos</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Combo Overview */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-4xl">{combo.cropIcon}</span>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-800">
                        {combo.crop} {combo.process}
                      </h1>
                      <p className="text-slate-600">{combo.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-bold text-lg">
                      Saves ₹{combo.price.savings} • {combo.benefit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <Star className="w-5 h-5 mx-auto text-yellow-500 fill-yellow-500 mb-1" />
                  <p className="text-xl font-bold text-slate-800">{combo.rating}</p>
                  <p className="text-xs text-slate-600">Rating</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl font-bold text-slate-800">{combo.usageCount}</p>
                  <p className="text-xs text-slate-600">Bookings</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <MapPin className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                  <p className="text-xl font-bold text-slate-800">{combo.distance}km</p>
                  <p className="text-xs text-slate-600">Away</p>
                </div>
              </div>
            </div>

            {/* 2. Equipment List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                Equipment Included
              </h2>
              <div className="space-y-4">
                {combo.equipments.map((equipment, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={equipment.image} 
                          alt={equipment.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800">{equipment.name}</h3>
                          
                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mt-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              equipment.available 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {equipment.available ? '✓ Available' : '✗ Unavailable'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              {equipment.condition}
                            </span>
                          </div>

                          {/* Specs */}
                          <div className="text-sm text-slate-600 mb-2">
                            {Object.entries(equipment.specs).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                <span className="font-semibold capitalize">{key}:</span> {value}
                              </span>
                            ))}
                          </div>

                          {/* Owner Info */}
                          <div className="flex items-center space-x-2 text-sm text-slate-700 bg-white/60 rounded-lg px-3 py-2 inline-flex">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span className="font-semibold">{equipment.owner}</span>
                            <span className="text-slate-500">• {equipment.ownerPhone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Availability Calendar */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                Availability Calendar
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Next available: <span className="font-bold text-green-600">{combo.availability.nextAvailable}</span>
              </p>
              
              {/* Calendar Grid */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-600">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDates.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold ${
                        day.status === 'available'
                          ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                          : 'bg-red-100 text-red-700 cursor-not-allowed'
                      }`}
                    >
                      {day.date}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-green-100"></div>
                    <span className="text-slate-600">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-red-100"></div>
                    <span className="text-slate-600">Booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50 sticky top-8">
              {/* 4. Pricing Breakdown */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Pricing Details</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Duration:</span>
                    <span className="font-semibold">{combo.duration}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Individual Price:</span>
                    <span className="line-through">₹{combo.price.individual}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Combo Discount:</span>
                    <span>- ₹{combo.price.savings}</span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-slate-300 pt-3 mb-4">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-700 font-semibold">Combo Price:</span>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">₹{combo.price.combo}</p>
                      <p className="text-xs text-slate-500">for {combo.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Savings Highlight */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 text-center border-2 border-green-200">
                  <p className="text-sm text-slate-600 mb-1">You Save</p>
                  <p className="text-2xl font-bold text-green-600">₹{combo.price.savings}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {Math.round((combo.price.savings / combo.price.individual) * 100)}% off individual price
                  </p>
                </div>
              </div>

              {/* 5. Trust & Safety */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Trust & Safety</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-slate-700">Rating</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800">{combo.rating}/5</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-700">Bookings</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800">{combo.usageCount}</span>
                  </div>
                  {combo.insuranceIncluded && (
                    <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-slate-700">Insurance</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">Included ✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Book Combo CTA */}
              <button
                onClick={handleBookCombo}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
              >
                Book Combo Now
              </button>
              <p className="text-xs text-center text-slate-500 mt-3">
                Free cancellation up to 24 hours before booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboDetails;