import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const OfflineContact = ({ farmer }) => {
    if (!farmer) return null;   // ⬅️ THIS LINE FIXES YOUR ERROR

  const handleCall = () => {
    window.location.href = `tel:${farmer.phone_number}`;
  };

  const handleSMS = () => {
    const message = 'Hello, I want to discuss equipment rental with you.';
    window.location.href = `sms:${farmer.phone_number}?body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Contact Me</h2>
        <p className="text-white/90">Quick and reliable communication</p>
      </div>

      {/* Horizontal Layout - Two Columns */}
      <div className="space-y-4">
        {/* Left Column - Buttons */}
        <div className="space-y-3">
          {/* Call Button */}
          <button
            onClick={handleCall}
            className="w-full group bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-105 border-2 border-white/30 flex items-center space-x-4"
          >
            <div className="bg-white text-orange-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-bold">Call Me</h3>
              <p className="text-sm text-white/90">{farmer.phone_number}</p>
            </div>
          </button>

          {/* SMS Button */}
          <button
            onClick={handleSMS}
            className="w-full group bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-105 border-2 border-white/30 flex items-center space-x-4"
          >
            <div className="bg-white text-red-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-bold">SMS Me</h3>
              <p className="text-sm text-white/90">{farmer.phone_number}</p>
            </div>
          </button>
        </div>

        {/* Right Column - Info */}
        <div className="space-y-3">
          {/* Offline Indicator */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">📡 Works without internet</span>
            </div>
            <p className="text-sm text-white/90">
              Call and SMS work in areas with no mobile data connection
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Response Time</span>
                <span className="font-bold">Under 2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Availability</span>
                <span className="font-bold">7 AM - 8 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineContact;