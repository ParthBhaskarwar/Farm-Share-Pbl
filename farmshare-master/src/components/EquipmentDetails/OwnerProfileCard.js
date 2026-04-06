import React, { useState } from 'react';
import { User, MapPin, Star, CheckCircle, TrendingUp } from 'lucide-react';
import api from '../../api/axios'
import { useEffect } from 'react';
import TrustCommunity from './TrustCommunity';
import { showError, showSuccess } from "./../../utils/toast";


const OwnerProfileCard = ({ owner, ownerTrustScore }) => {
  const [myBookings, setMyBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);

  //for fetching bookings of equipment owner
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await api.get("/api/farmer/myBookings");
        setMyBookings(response.data.bookings);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchMyBookings();
  }, []);

  //for fetching reviews of equipment owner
  useEffect(() => {
    if (owner?._id) {
      const fetchReviews = async () => {
        try {
          const res = await api.get(`/api/farmer/${owner._id}/review`);
          setMyReviews(res.data.reviews);
        } catch (err) {
          showError(err.response?.data?.message || "Something went wrong");
        }
      };
      fetchReviews();
    }
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden shadow-xl h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Equipment Owner</h2>
          <User className="w-8 h-8" />
        </div>
        <p className="text-white/90">Trusted farmer in your community</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Owner Info */}
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
              {owner.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{owner.name}</h3>
            <div className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
              <span>👨‍🌾</span>
              <span>Farmer Owner</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{owner.village} ,{owner.district}</span>
            </div>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Completed Rentals */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-slate-600 font-medium">Completed Rentals</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{myBookings.length}</p>
          </div>
          {/* Trust Score */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-xs text-slate-600 font-medium">Trust Score</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{ownerTrustScore}</p>
          </div>
        </div>
        {/* Reviews Section */}
        <TrustCommunity reviews={myReviews} />
      </div>
    </div>
  );
};

export default OwnerProfileCard;