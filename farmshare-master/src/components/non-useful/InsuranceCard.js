import React, { useState } from 'react';
import { Shield, CheckCircle, DollarSign } from 'lucide-react';

const InsuranceCard = () => {
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Insurance & Deposit</span>
        </h3>
        <button 
          onClick={() => setInsuranceEnabled(!insuranceEnabled)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
            insuranceEnabled 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-slate-600 hover:bg-blue-50'
          }`}
        >
          {insuranceEnabled ? '✓ Enabled' : 'Enable'}
        </button>
      </div>

      <div className="space-y-3">
        {/* Security Deposit */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-slate-600" />
            <span className="text-slate-600">Security Deposit</span>
          </div>
          <span className="text-xl font-bold text-slate-800">₹5,000</span>
        </div>

        {/* Insurance Fee (Conditional) */}
        {insuranceEnabled && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-slate-600">Insurance Fee</span>
            </div>
            <span className="text-xl font-bold text-blue-600">₹250</span>
          </div>
        )}

        {/* Coverage Details */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">
              {insuranceEnabled ? 'Your Coverage Includes:' : 'Protection Available:'}
            </span>
          </div>
          <ul className="text-sm space-y-1 ml-7">
            <li>• Damage protection up to ₹50,000</li>
            <li>• Theft coverage</li>
            <li>• Breakdown assistance 24/7</li>
            <li>• No-fault accident protection</li>
          </ul>
        </div>

        {/* Total Display */}
        <div className={`rounded-xl p-4 flex items-center justify-between ${
          insuranceEnabled 
            ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white' 
            : 'bg-white/60 backdrop-blur-sm'
        }`}>
          <span className={`font-semibold ${insuranceEnabled ? 'text-white' : 'text-slate-700'}`}>
            Total Deposit Required
          </span>
          <span className={`text-2xl font-bold ${insuranceEnabled ? 'text-white' : 'text-slate-800'}`}>
            ₹{insuranceEnabled ? '5,250' : '5,000'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;