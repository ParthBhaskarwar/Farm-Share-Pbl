import React from 'react';
import { Search, MapPin, Phone, MessageSquare } from 'lucide-react';

const EmptyState = ({ searchQuery, onExpandDistance }) => {
  return (
    <div className="text-center py-16">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/40 max-w-2xl mx-auto">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mb-6">
          <Search className="w-12 h-12 text-slate-500" />
        </div>

        {/* Message */}
        <h3 className="text-3xl font-bold text-slate-800 mb-3">
          {searchQuery ? 'No Equipment Found' : 'Start Your Search'}
        </h3>
        
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          {searchQuery 
            ? `We couldn't find any equipment matching "${searchQuery}" in your area.`
            : 'Use the search bar above to find equipment near you.'}
        </p>

        {/* Suggestions */}
        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h4 className="font-bold text-blue-900 mb-2">Try Expanding Your Search</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Equipment might be available slightly farther away. Expanding your search radius could help.
                </p>
                <button
                  onClick={onExpandDistance}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Search Within 50km
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Call Option */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="font-bold text-green-900 mb-2">Call for Help</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Speak to our team to find equipment manually
                  </p>
                  <a
                    href="tel:1800-FARM-HELP"
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>1800-FARM-HELP</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SMS Option */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="font-bold text-purple-900 mb-2">Book via SMS</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Send requirements via SMS (works offline)
                  </p>
                  <a
                    href="sms:1800-FARM-HELP?body=I need equipment. Please help."
                    className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send SMS</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-left">
          <h4 className="font-bold text-yellow-900 mb-3 flex items-center space-x-2">
            <span>💡</span>
            <span>Search Tips</span>
          </h4>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start space-x-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Try different keywords (e.g., "tractor" instead of "John Deere")</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Select a different category from the filters</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Adjust your date range - equipment may be available on different dates</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Contact equipment owners directly via call or SMS</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;