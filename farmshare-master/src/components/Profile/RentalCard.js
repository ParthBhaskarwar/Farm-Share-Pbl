import React, { useState } from 'react';
import { Calendar, User, MapPin, Camera, Upload, X, Check } from 'lucide-react';
import api from '../../api/axios';
import { showError } from '../../utils/toast';

const RentalCard = ({ rental }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'pickup' or 'return'
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-300';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'upcoming': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      showError('Please upload a geo-tagged image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', modalType); // 'pickup' or 'return'

    try {
      const endpoint = modalType === 'pickup' 
        ? `/booking/${rental._id}/upload-pickup-image`
        : `/booking/${rental._id}/upload-return-image`;
      
      await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showError(`${modalType === 'pickup' ? 'Pickup' : 'Return'} image uploaded successfully! Owner will verify with OTP.`);
      setShowModal(false);
      setImage(null);
      setImagePreview(null);
      window.location.reload(); // Refresh to show updated status
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImage(null);
    setImagePreview(null);
    setModalType('');
  };

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-1">{rental.equipment.equipmentName}</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{rental.equipment.farmer.village}</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(rental.bookingStatus)}`}>
              {rental.bookingStatus.charAt(0).toUpperCase() + rental.bookingStatus.slice(1)}
            </div>
          </div>

          {/* Equipment Image (small) */}
          {rental.equipment.images && rental.equipment.images[0] && (
            <div className="h-32 rounded-xl overflow-hidden">
              <img src={rental.equipment.images[0].url} alt={rental.equipment.equipmentName} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Owner Info */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              {rental.equipment.farmer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{rental.equipment.farmer.name}</p>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <User className="w-3 h-3" />
                <span>Equipment Owner</span>
              </div>
            </div>
          </div>

          {/* Booking Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-600 font-medium">Start Date</span>
              </div>
              <p className="text-sm font-bold text-blue-600">{rental.startDate}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-slate-600 font-medium">End Date</span>
              </div>
              <p className="text-sm font-bold text-purple-600">{rental.endDate}</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <span className="text-slate-600">Total Amount</span>
            <span className="text-2xl font-bold text-green-600">₹{rental.totalAmount}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            {/* Got Equipment Button - Show only if confirmed and not picked up yet */}
            {rental.bookingStatus === 'confirmed' && !rental.pickupConfirmed && (
              <button
                onClick={() => handleOpenModal('pickup')}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Got Equipment?</span>
              </button>
            )}

            {/* Returned Equipment Button - Show only if picked up and not returned yet */}
            {rental.pickupConfirmed && !rental.returnConfirmed && (
              <button
                onClick={() => handleOpenModal('return')}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Returned Equipment?</span>
              </button>
            )}

            {/* Status Messages */}
            {rental.pickupConfirmed && !rental.returnConfirmed && (
              <div className="col-span-2 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-sm text-green-700 font-semibold">✓ Equipment Picked Up</p>
              </div>
            )}

            {rental.returnConfirmed && (
              <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <p className="text-sm text-blue-700 font-semibold">✓ Equipment Returned Successfully</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Image Upload */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred Background */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {modalType === 'pickup' ? 'Confirm Equipment Pickup' : 'Confirm Equipment Return'}
              </h3>
              <p className="text-sm text-slate-600">
                Upload a geo-tagged photo of the equipment. The owner will verify with OTP.
              </p>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Upload Geo-Tagged Image *
              </label>
              
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl hover:border-green-500 cursor-pointer transition-colors bg-slate-50">
                  <Upload className="w-12 h-12 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600 font-medium">Click to upload image</span>
                  <span className="text-xs text-slate-500 mt-1">GPS location will be extracted</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                📍 Make sure location services are enabled on your device. The image will be verified by the owner using an OTP sent to your email.
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!image || loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Submit Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RentalCard;