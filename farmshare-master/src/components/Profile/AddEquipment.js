import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Camera, MapPin, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import api from './../../api/axios';
import { showError, showSuccess } from "./../../utils/toast";

const AddEquipmentPage = () => {
  const navigate = useNavigate();

  // Step 1: Equipment Selection
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');

  // Step 2: Equipment Details
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pricePerDay, setPricePerDay] = useState('');
  const [year, setYear] = useState('');
  const [hours, setHours] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [includesOperator, setIncludesOperator] = useState(false);
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationLoading, setLocationLoading] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);

  // Fetch equipment types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await api.get('/api/equipment/catalog/types');
        setTypes(response.data.types || []);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchTypes();
  }, []);

  // Fetch equipment options when type is selected
  useEffect(() => {
    if (!selectedType) {
      setEquipmentOptions([]);
      return;
    }

    const fetchEquipment = async () => {
      try {
        const response = await api.get(`/api/equipment/catalog/type/${selectedType}`);
        setEquipmentOptions(response.data.equipment || []);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchEquipment();
  }, [selectedType]);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Get current location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showError("Failed to fetch location");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationLoading(false);
      },
      (error) => {
        showError(error.response?.data?.message || "Something went wrong");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedEquipment) {
      return;
    }

    if (images.length === 0) {
      return;
    }

    if (!location.lat || !location.lng) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append images
      images.forEach(image => {
        formData.append('images', image);
      });

      // Append data
      formData.append('equipmentId', selectedEquipment);
      formData.append('pricePerDay', pricePerDay);
      formData.append('specs', JSON.stringify({ year: parseInt(year), hours: parseInt(hours) }));
      formData.append('hasInsurance', hasInsurance);
      formData.append('includesOperator', includesOperator);
      formData.append('lastServiceDate', lastServiceDate);
      formData.append('nextServiceDate', nextServiceDate);
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);


      const response = await api.post(`/api/equipment/${selectedEquipment}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showSuccess('Equipment registered successfully');

      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">List Your Equipment</h1>
          <p className="text-slate-600">Fill in the details below to list your equipment for rent</p>
        </div>


        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          
          {/* Step 1: Select Equipment */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-2">
              Step 1: Select Equipment
            </h2>

            {/* Equipment Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Equipment Type <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedEquipment('');
                }}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select equipment type</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Equipment Name */}
            {selectedType && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Equipment Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select equipment</option>
                  {equipmentOptions.map(eq => (
                    <option key={eq._id} value={eq._id}>{eq.equipmentName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Step 2: Equipment Details */}
          {selectedEquipment && (
            <>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-2">
                  Step 2: Equipment Details
                </h2>

                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Equipment Photos <span className="text-red-500">*</span> (Max 5)
                  </label>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {images.length < 5 && (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:border-green-500 cursor-pointer transition-colors">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <span className="text-sm text-slate-600">Click to upload photos</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Price Per Day */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price Per Day (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    required
                    min="1"
                    placeholder="e.g., 1500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Specs Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Manufacturing Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                      min="1990"
                      max={new Date().getFullYear()}
                      placeholder="e.g., 2020"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Hours Used <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      required
                      min="0"
                      placeholder="e.g., 1200"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Service Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Last Service Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={lastServiceDate}
                      onChange={(e) => setLastServiceDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Next Service Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={nextServiceDate}
                      onChange={(e) => setNextServiceDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasInsurance}
                      onChange={(e) => setHasInsurance(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-slate-700 font-medium">Equipment has insurance</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesOperator}
                      onChange={(e) => setIncludesOperator(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-slate-700 font-medium">Includes operator</span>
                  </label>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Equipment Location <span className="text-red-500">*</span>
                  </label>
                  
                  {location.lat && location.lng ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-800 font-semibold flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Location Captured
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locationLoading}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <MapPin className={`w-5 h-5 ${locationLoading ? 'animate-pulse' : ''}`} />
                      <span>{locationLoading ? 'Getting Location...' : 'Capture Current Location'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>{loading ? 'Submitting...' : 'Submit for Inspection'}</span>
                </button>
                <p className="text-sm text-slate-600 text-center mt-3">
                  Your equipment will be reviewed and published after inspection
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddEquipmentPage;