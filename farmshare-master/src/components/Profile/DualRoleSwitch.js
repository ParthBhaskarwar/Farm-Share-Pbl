import React from 'react';
import { Search, Tractor } from 'lucide-react';

const DualRoleSwitch = ({ activeRole, onRoleChange }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-2 shadow-lg mb-8">
      <div className="grid grid-cols-2 gap-2">
        {/* I Need Equipment */}
        <button
          onClick={() => onRoleChange('need')}
          className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
            activeRole === 'need'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl scale-105'
              : 'bg-white/50 text-slate-600 hover:bg-white'
          }`}
        >
          <Search className={`w-6 h-6 ${activeRole === 'need' ? 'animate-pulse' : ''}`} />
          <div className="text-left">
            <p className="text-sm opacity-80">I Need</p>
            <p>Equipment</p>
          </div>
        </button>

        {/* I Own Equipment */}
        <button
          onClick={() => onRoleChange('own')}
          className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
            activeRole === 'own'
              ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-xl scale-105'
              : 'bg-white/50 text-slate-600 hover:bg-white'
          }`}
        >
          <Tractor className={`w-6 h-6 ${activeRole === 'own' ? 'animate-pulse' : ''}`} />
          <div className="text-left">
            <p className="text-sm opacity-80">I Own</p>
            <p>Equipment</p>
          </div>
        </button>
      </div>

      {/* Role Description */}
      <div className="mt-4 px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl">
        <p className="text-sm text-slate-600 text-center">
          {activeRole === 'need' ? (
            <span>📋 View your rental history, active bookings, and saved equipment</span>
          ) : (
            <span>🚜 Manage your equipment, track earnings, and view booking requests</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default DualRoleSwitch;