import React, { useState } from 'react';
import { Shield, Calendar, EqualIcon } from 'lucide-react';
import api from '../../api/axios';
import { showError, showSuccess } from "./../../utils/toast";


const PricingBookingCard = ({ equipment, currentEquipmentId, distance }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isOperatorRequired, setIsOperatorRequired] = useState(false);
  const [workType, setWorkType] = useState(null);
  const [landSize, setLandSize] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isTransportRequired, setIsTransportRequired] = useState(false);
  const [priceData, setPriceData] = useState(null);

  // Calculate time slots based on duration
  const getTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    const durationHours = parseInt(duration);

    for (let i = startHour; i <= endHour - durationHours; i++) {
      const startTime = `${i}:00`;
      const endTime = `${i + durationHours}:00`;
      slots.push({
        value: `${startTime}-${endTime}`,
        label: `${startTime} - ${endTime}`
      });
    }
    return slots;
  };

  // Check if all required fields are filled
  const canShowPrice = () => {
    if (!selectedDate) return false;

    if (equipment.includesOperator && isOperatorRequired) {
      if (!workType || !landSize || !selectedTimeSlot) return false;
    } else {
      if (!duration || !selectedTimeSlot) return false;
    }

    return true;
  };

  // Handle Price Controller
  const handlePrice = async () => {
    try {
      const res = await api.post(`/api/equipment/price/${currentEquipmentId}`, {
        distance,
        duration,
        isOperatorRequired,
        process: workType?.process,
        landSize,
        isTransportRequired
      });
      setPriceData(res.data);
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Handle Payment Controller
  const handlePayment = async () => {
    try {
      const [startTime, endTime] = selectedTimeSlot.split("-");

      const { data } = await api.post(
        `/api/booking/create-order/${currentEquipmentId}`,
        {
          amount: Math.round(priceData.dynamicPrice),
          startDate: selectedDate,
          startTime,
          endTime,
          duration: priceData.duration || duration,
          isOperatorRequired,
          process: workType?.process,
          landSize,
          isTransportRequired
        }
      );

      const { order, booking } = data;
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "My MERN App",
        description: "Test Payment",
        order_id: order.id,

        handler: async function (response) {
          await api.post(
            "/api/booking/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            }
          );
          showSuccess('Payment Successful')
          setSelectedDate('');
          setDuration('');
          setIsOperatorRequired(false);
          setIsTransportRequired(false);
          setLandSize('');
          setSelectedTimeSlot('');
          setWorkType(null);
          setPriceData(null);
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl sticky top-24">
      <div className="p-6 space-y-6">
        {/* Pricing Header */}
        <div>
          <div className="flex items-baseline space-x-3 mb-2">
            <span className="text-4xl font-bold text-green-600">
              ₹{priceData ? (priceData.basePrice / (priceData.duration || duration || 1)).toFixed(0) : equipment.dynamicPrice}
            </span>
            <span className="text-slate-600 text-lg">/ hr</span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {/* Title */}
          <h3 className="font-bold text-slate-800 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Book Your Rental</span>
          </h3>

          {/* Date Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Operator Required (if equipment includes operator) */}
          {equipment.includesOperator && (
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOperatorRequired}
                  onChange={(e) => {
                    setIsOperatorRequired(e.target.checked);
                    setWorkType(null);
                    setLandSize('');
                    setDuration('');
                    setSelectedTimeSlot('');
                  }}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-slate-700">Operator Required</span>
              </label>
            </div>
          )}

          {/* If Operator Required - Show Work Type & Land Size */}
          {/* If Operator Required - Show Work Type & Land Size */}
          {equipment.includesOperator && isOperatorRequired && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Type *
                </label>

                <select
                  value={workType?.process || ""}
                  onChange={(e) => {
                    const selected = equipment?.equipment?.suitableProcesses?.find(
                      p => p.process === e.target.value
                    );
                    setWorkType(selected || null);
                    setDuration(selected?.duration || '');
                    setSelectedTimeSlot('');
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select work type</option>

                  {equipment?.equipment?.suitableProcesses &&
                    Array.isArray(equipment.equipment.suitableProcesses) &&
                    equipment.equipment.suitableProcesses.map((proc, index) => (
                      <option key={index} value={proc.process}>
                        {String(proc.process)} ({String(proc.duration)} hrs)
                      </option>
                    ))}

                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Land Size (acres) *
                </label>

                <input
                  type="number"
                  value={landSize}
                  onChange={(e) => {
                    setLandSize(e.target.value);
                    setSelectedTimeSlot('');
                  }}
                  min="0.5"
                  step="0.5"
                  placeholder="e.g., 2"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </>
          )}

          {/* If Operator NOT Required - Show Duration */}
          {(!equipment.includesOperator || !isOperatorRequired) && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration *
              </label>
              <select
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setSelectedTimeSlot('');
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select duration</option>
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="3">3 Hours</option>
                <option value="4">4 Hours</option>
              </select>
            </div>
          )}

          {/* Time Slot Selector */}
          {((equipment.includesOperator && isOperatorRequired && workType && landSize) ||
            (!equipment.includesOperator && duration) ||
            (equipment.includesOperator && !isOperatorRequired && duration)) && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time Slot *
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select time slot</option>
                  {getTimeSlots().map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Transport Required (if equipment includes transport) */}
          {equipment.includesTransport && selectedTimeSlot && (
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTransportRequired}
                  onChange={(e) => setIsTransportRequired(e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-slate-700">Transport Required</span>
              </label>
            </div>
          )}
        </div>

        {/* Show Price Button */}
        {canShowPrice() && !priceData && (
          <button
            disabled={!equipment.available}
            onClick={handlePrice}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${equipment.available
              ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-2xl hover:scale-105'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
          >
            {equipment.available ? 'Show Price' : 'Currently Unavailable'}
          </button>
        )}

        {/* Price Breakdown */}
        {priceData && (
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-800 mb-3">Price Breakdown</h4>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Base price</span>
              <span className="font-semibold text-slate-800">₹{priceData.basePrice}</span>
            </div>

            {priceData.deliveryCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Delivery Charges</span>
                <span className="font-semibold text-slate-800">₹{priceData.deliveryCharge}</span>
              </div>
            )}

            {priceData.operatorCharge > 0 && (
              <div className="flex justify-between text-sm items-center">
                <div className="flex items-center space-x-1">
                  <span className="text-slate-600">Operator Charges</span>
                </div>
                <span className="font-semibold text-slate-800">₹{priceData.operatorCharge}</span>
              </div>
            )}

            <div className="border-t border-slate-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-green-600 text-xl">₹{priceData.dynamicPrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Book Now Button*/}
        {priceData && (
          <button
            disabled={!equipment.available}
            onClick={handlePayment}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${equipment.available
              ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-2xl hover:scale-105'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
          >
            {equipment.available ? 'Book Now' : 'Currently Unavailable'}
          </button>
        )}

      </div>
    </div>
  );
};

export default PricingBookingCard;