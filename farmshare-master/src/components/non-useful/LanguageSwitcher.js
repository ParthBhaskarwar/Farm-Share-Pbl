import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  const handleLanguageSelect = (code) => {
    setSelectedLang(code);
    setIsOpen(false);
    // Here you would integrate with your i18n system
    console.log(`Language switched to: ${code}`);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-green-200 hover:bg-white transition-all"
      >
        <Globe className="w-5 h-5 text-green-600" />
        <span className="text-sm font-medium text-slate-700">
          {languages.find(l => l.code === selectedLang)?.name}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-green-100 overflow-hidden z-50 min-w-[200px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-sm font-medium text-slate-700">{lang.name}</span>
              </div>
              {selectedLang === lang.code && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;