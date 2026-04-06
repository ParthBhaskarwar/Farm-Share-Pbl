import React, { useState } from 'react';
import { useEffect } from 'react';
import api from '../../api/axios';
import { MapPin, Star, BadgeCheck, Award, Edit,User } from 'lucide-react';
import { showError } from '../../utils/toast';

const ProfileHeader = ({ farmer, onEdit, myBookings }) => {

   const [ownerTrustScore,setOwnerTrustScore]=useState(0);
   const [renterTrustScore,setRenterTrustScore]=useState(0);
   const [myEquipments,setMyEquipments]=useState([]);


    useEffect(() => {
        const fetchOwnerTrust = async () => {
          try {
            const response = await api.get(`/api/farmer/ownerTrust/${farmer._id}`);
            setOwnerTrustScore(response.data.ownerTrustStats.trustScore);
          } catch (err) {
            showError(err.response?.data?.message || "Something went wrong");
          }
        };
        fetchOwnerTrust();
      }, []);

      useEffect(() => {
        const fetchRenterTrust = async () => {
          try {
            const response = await api.get(`/api/farmer/renterTrust/${farmer._id}`);
            setRenterTrustScore(response.data.renterTrustStats.trustScore);
          } catch (err) {
            showError(err.response?.data?.message || "Something went wrong");
          }
        };
        fetchRenterTrust();
      }, []);

      useEffect(() => {
        const fetchMyEquipments = async () => {
          try {
            const response = await api.get(`/api/farmer/myEquipments`);
            setMyEquipments(response.data.equipments);
          } catch (err) {
            showError(err.response?.data?.message || "Something went wrong");
          }
        };
        fetchMyEquipments();
      }, []);
    

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 overflow-hidden shadow-2xl mb-8">
            {/* Background Gradient */}
            <div className="h-32 bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
            </div>
            <div className="px-8 pb-8 mt-6 relative">

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left Side - Profile Info */}
                    <div className="flex flex-col gap-8 lg:max-w-[65%]">
                        {/* Profile Photo */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

                            <div className="relative">
                               <img
                                    src={`${farmer.photo}`}
                                    alt={farmer.name}
                                    className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl object-cover"
                                />
                                <button
                                    onClick={onEdit}
                                    className="absolute bottom-0 right-0 bg-gradient-to-r from-green-600 to-emerald-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                {/* Online Indicator */}
                                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>

                            {/* Info */}
                            <div className="text-center md:text-left space-y-3">
                                <div>
                                    <h1 className="text-4xl font-bold text-slate-800 mb-2">{farmer.name}</h1>
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-600">
                                            <MapPin className="w-4 h-4" />
                                            <span className="font-medium">{farmer.village}, {farmer.district}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="flex items-center justify-center md:justify-start space-x-4 pt-2">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{myBookings?.length}</p>
                                        <p className="text-xs text-slate-600">Bookings</p>
                                    </div>
                                    <div className="w-px h-10 bg-slate-300"></div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{myEquipments?.length}</p>
                                        <p className="text-xs text-slate-600">Equipment</p>
                                    </div>
                                    <div className="w-px h-10 bg-slate-300"></div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-600">₹{(farmer.earnings / 1000).toFixed(0)}K</p>
                                        <p className="text-xs text-slate-600">Earned</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                Profile Overview
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl p-6 text-white">
                                    <p className="text-white/80 mb-2">Preferred Language</p>
                                    <p className="text-xl font-bold">{farmer.preferredLanguage}</p>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
                                    <p className="text-white/80 mb-2">Crops you grow</p>
                                    <p className="text-xl font-bold">{farmer.preferredCrops.join(", ")} </p>
                                </div>
                                {/* 
                                <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-6 text-white">
                                    <p className="text-white/80 mb-2">Notification Preference</p>
                                    <p className="text-xl font-bold">{farmer.notificationPreference}</p>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Trust Box */}
                    <div className="w-full lg:w-auto flex flex-col gap-4">
                        {/* First Trust Box - Play Store Style */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl w-full lg:min-w-[420px] lg:max-w-[480px]">
                            <h3>Owner Trust Score</h3>
                            <div className="flex items-start gap-6">

                                {/* Left - Score */}
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-slate-800 mb-1">{ownerTrustScore}</div>
                                    <div className="flex items-center justify-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-3 h-3 ${star <= Math.floor(ownerTrustScore) ? 'fill-green-600 text-green-600' : 'fill-slate-300 text-slate-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">35M reviews</p>
                                </div>

                                {/* Right - Rating Bars */}
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-xs text-slate-600 w-2">{rating}</span>
                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-600 rounded-full"
                                                    style={{
                                                        width: rating === 5 ? '85%' :
                                                            rating === 4 ? '12%' :
                                                                rating === 3 ? '2%' :
                                                                    rating === 2 ? '0.5%' : '0.5%'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Second Trust Box - Play Store Style */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl w-full lg:min-w-[420px] lg:max-w-[480px]">
                            <h3>Renter Trust Score</h3>
                            <div className="flex items-start gap-6">
                                {/* Left - Score */}
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-slate-800 mb-1">{renterTrustScore.toFixed(1)}</div>
                                    <div className="flex items-center justify-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-3 h-3 ${star <= Math.floor(renterTrustScore) ? 'fill-green-600 text-green-600' : 'fill-slate-300 text-slate-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">35M reviews</p>
                                </div>

                                {/* Right - Rating Bars */}
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-xs text-slate-600 w-2">{rating}</span>
                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-600 rounded-full"
                                                    style={{
                                                        width: rating === 5 ? '85%' :
                                                            rating === 4 ? '12%' :
                                                                rating === 3 ? '2%' :
                                                                    rating === 2 ? '0.5%' : '0.5%'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;