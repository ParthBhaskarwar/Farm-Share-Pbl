import React from 'react';
import { CheckCircle } from 'lucide-react';

const ServicesIncluded = () => {
  const services = [
    {
      icon: '👨‍🔧',
      title: 'Operator Included',
      description: 'Experienced operator provided for complex operations',
      included: true
    },
    {
      icon: '🚚',
      title: 'Transport Available',
      description: 'Equipment can be delivered to your farm location',
      included: true,
      note: 'Extra ₹200 within 10km'
    },
    {
      icon: '🛠️',
      title: 'On-site Support',
      description: '24/7 technical support if equipment needs assistance',
      included: true
    },
    {
      icon: '⛽',
      title: 'Fuel Included',
      description: 'First tank of fuel included in rental price',
      included: false,
      note: 'Pay for additional fuel'
    }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Services Included</h2>
      <p className="text-slate-600 mb-6">Value-added services that justify the pricing</p>

      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <div
            key={index}
            className={`rounded-xl p-5 border-2 transition-all hover:scale-105 ${
              service.included
                ? 'bg-green-50 border-green-300'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{service.icon}</div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-slate-800">{service.title}</h3>
                  {service.included && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                
                {service.note && (
                  <p className={`text-xs font-semibold ${
                    service.included ? 'text-orange-700' : 'text-slate-600'
                  }`}>
                    {service.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Value Proposition */}
      <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-5 text-white">
        <p className="font-bold text-lg mb-2">💡 Why This is Great Value</p>
        <p className="text-sm text-white/90">
          With operator, transport, and support included, you save ₹1,500+ compared to hiring separately. 
          Focus on farming, we handle the equipment!
        </p>
      </div>
    </div>
  );
};

export default ServicesIncluded;