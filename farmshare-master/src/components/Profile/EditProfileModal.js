import React, { useState } from 'react';
import { X, User, MapPin, Globe, Sprout, Bell, Camera } from 'lucide-react';
import api from '../../api/axios';
import { showError, showSuccess } from '../../utils/toast';

const EditProfileModal = ({ farmer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: farmer.name,
    village: farmer.village,
    district: farmer.district,
    preferredLanguage: farmer.preferredLanguage || 'English',
    preferredCrops: farmer.preferredCrops || [],
    notificationPreference: farmer.notificationPreference || 'app'
  });

  const [profilePhoto, setProfilePhoto] = useState(farmer.photo || null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  const languages = ['English', 'हिंदी (Hindi)', 'मराठी (Marathi)', 'ਪੰਜਾਬੀ (Punjabi)'];
  const crops = ['Cotton', 'Wheat', 'Soybean', 'Rice', 'Sugarcane', 'Pulses', 'Vegetables', 'Fruits'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCrop = (crop) => {
    setFormData(prev => ({
      ...prev,
      preferredCrops: prev.preferredCrops.includes(crop)
        ? prev.preferredCrops.filter(c => c !== crop)
        : [...prev.preferredCrops, crop]
    }));
  };

  // ✅ UPDATED: Single API call with FormData
  const handleSubmit = async () => {
    try {
      const formPayload = new FormData();

      // 1. Add photo if changed
      if (profilePhotoFile) {
        formPayload.append('photo', profilePhotoFile);
      }

      // 2. Add all text fields
      formPayload.append('name', formData.name);
      formPayload.append('village', formData.village);
      formPayload.append('district', formData.district);
      formPayload.append('preferredLanguage', formData.preferredLanguage);
      formPayload.append('notificationPreference', formData.notificationPreference);

      // 3. Add array as JSON string
      formPayload.append('preferredCrops', JSON.stringify(formData.preferredCrops));

      // 4. Single API call
      const response = await api.patch('/api/farmer/profile', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showSuccess('Profile updated successfully! ✅');
      onSave(response.data.farmer);
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");

    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePhotoFile(file);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-white shadow-lg">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-green-600" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-slate-600">Click camera icon to change photo</p>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <span>Basic Information</span>
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Village
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Preferred Language</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {languages.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, preferredLanguage: lang }))}
                  className={`p-4 rounded-xl border-2 transition-all ${formData.preferredLanguage === lang
                      ? 'border-green-600 bg-green-50 font-bold'
                      : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Crops */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <Sprout className="w-5 h-5 text-green-600" />
              <span>Crops You Grow</span>
            </h3>

            <div className="flex flex-wrap gap-3">
              {crops.map(crop => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => toggleCrop(crop)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${formData.preferredCrops.includes(crop)
                      ? 'border-green-600 bg-green-50 text-green-700 font-bold'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {formData.preferredCrops.includes(crop) && '✓ '}
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Preference */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-purple-600" />
              <span>Notification Preference</span>
            </h3>

            <div className="space-y-3">
              {[
                { value: 'app', label: 'App Notifications', icon: '📱', desc: 'Get notified in the app' },
                { value: 'sms', label: 'SMS Messages', icon: '💬', desc: 'Receive SMS updates' },
                { value: 'call', label: 'Phone Calls', icon: '📞', desc: 'Get important calls' }
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.notificationPreference === option.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="notificationPreference"
                    value={option.value}
                    checked={formData.notificationPreference === option.value}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="text-2xl">{option.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{option.label}</p>
                    <p className="text-sm text-slate-600">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;