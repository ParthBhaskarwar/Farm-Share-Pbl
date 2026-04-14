import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, Wrench, Clock, BookmarkPlus, FileText, Tractor, CookingPot, Cross, HandCoins, CircleAlert, X } from 'lucide-react';
import ProfileHeader from '../components/Profile/ProfileHeader';
import DualRoleSwitch from '../components/Profile/DualRoleSwitch';
import EquipmentOwnerCard from '../components/Profile/EquipmentOwnerCard';
import RentalCard from '../components/Profile/RentalCard';
import TrustCommunity from '../components/EquipmentDetails/TrustCommunity';
import EditProfileModal from '../components/Profile/EditProfileModal';
import api from './../api/axios';
import PastRentalCard from '../components/Profile/PastRentalCard';
import { FarmerReviewModal, EquipmentReviewModal } from '../components/Profile/ReviewModals';
import { showError, showSuccess } from '../utils/toast';

const Profile = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('own');
  const [activeTab, setActiveTab] = useState('equipment');
  const [showEditModal, setShowEditModal] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [myEquipments, setMyEquipments] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [showFarmerReviewModal, setShowFarmerReviewModal] = useState(false);
  const [showEquipmentReviewModal, setShowEquipmentReviewModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  // for fetching profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/farmer/profile");
        setFarmer(response.data.farmer);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
        navigate("/auth"); 
      }
    };
    fetchProfile();
  }, [navigate]);

  // for fetching role
  useEffect(() => {
    if (activeRole === 'own') {
      setActiveTab('equipment');
    } else {
      setActiveTab('current');
    }
  }, [activeRole]);

  // for fetching my equipments
  useEffect(() => {
    const fetchMyEquipments = async () => {
      try {
        const response = await api.get("/api/farmer/myEquipments");
        setMyEquipments(response.data.equipments);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchMyEquipments();
  }, []);

  // for fetching my booking
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

  //for fetching my rentals 
  useEffect(() => {
    const fetchMyRentals = async () => {
      try {
        const response = await api.get("/api/farmer/myRentals");
        setMyRentals(response.data.rentals);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchMyRentals();
  }, []);

  //// for saving edit profile pages
  const handleSaveProfile = async (formData) => {
    console.log('Saving profile:', formData);
    try {
      const res = await api.patch("/api/farmer/profile", formData);
      
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    }

  };

  // for opening farmer review 
  const openFarmerReviewModal = (rental) => {
    setSelectedRental(rental);
    setShowFarmerReviewModal(true);
  };

  // for opening equipment review
  const openEquipmentReviewModal = (rental) => {
    setSelectedRental(rental);
    setShowEquipmentReviewModal(true);
  };

  // for saving farmer review 
  const handleFarmerReviewSubmit = async (reviewData) => {
    try {
      await api.post(`/api/farmer/review/${selectedRental?.equipment.farmer._id}`, reviewData);
      showSuccess('Farmer review submitted successfully!');
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  // for saving equipment review 
  const handleEquipmentReviewSubmit = async (reviewData) => {
    try {
      await api.post(`/api/equipment/review/${selectedRental.equipment._id}`, reviewData);
      showSuccess('Equipment review submitted successfully!');
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Tabs for "I Own Equipment"
  const ownerTabs = [
    { id: 'equipment', label: 'My Equipment', icon: Package },
    { id: 'bookings', label: 'Active Bookings', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'health', label: 'Equipment Health', icon: Wrench }
  ];

  // Tabs for "I Need Equipment"
  const renterTabs = [
    { id: 'current', label: 'Current Rentals', icon: Clock },
    { id: 'past', label: 'Past Rentals', icon: Calendar },
  ];

  const tabs = activeRole === 'own' ? ownerTabs : renterTabs;

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpType, setOtpType] = useState(''); // 'pickup' or 'return'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async (bookingId, type) => {
    if (otp.length !== 6) {
      showError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const endpoint = type === 'pickup'
        ? `/booking/${bookingId}/confirm-pickup`
        : `/booking/${bookingId}/confirm-return`;

      await api.post(endpoint, { otp });
      showSuccess(`${type === 'pickup' ? 'Pickup' : 'Return'} confirmed successfully!`);
      setShowOtpModal(false);
      setOtp('');
      window.location.reload();
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  if (!farmer) {
    return <p>Loading profile...</p>;
  }
  
  else {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Profile Header */}
          <div className="scale-[0.95] origin-top">
            <ProfileHeader farmer={farmer} onEdit={() => setShowEditModal(true)} myBookings={myBookings} />
          </div>

          {/* Dual Role Switch */}
          <DualRoleSwitch activeRole={activeRole} onRoleChange={setActiveRole} />

          {/* Tabs */}
          <div className="mb-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-2 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg'
                        : 'bg-white/50 text-slate-600 hover:bg-white'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden md:inline">{tab.label}</span>
                      <span className="md:hidden text-sm">{tab.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-6">
              {/* I Own Equipment Content */}
              {activeRole === 'own' && (
                <>
                  {/* Showing equipments of farmer */}
                  {activeTab === 'equipment' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-800">My Equipment</h2>
                        <Link to="/equipment/add" className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
                          + Add Equipment
                        </Link>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myEquipments?.length === 0 ?
                          <div className=" col-span-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                            <div className="text-center py-12">
                              <Tractor className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                              <p className="text-slate-600">No Equipments registered</p>
                            </div>
                          </div>
                          : myEquipments?.map(equipment => (
                            <EquipmentOwnerCard key={equipment._id} equipment={equipment} />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Showing bookings of farmer */}
                  {activeTab === 'bookings' && (
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                      <h2 className="text-2xl font-bold text-slate-800 mb-4">Active Bookings</h2>
                      {myBookings?.length == 0 ?
                        <div className=" col-span-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                          <div className="text-center py-12">
                            <CookingPot className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600">No Active Bookings</p>
                          </div>
                        </div>
                        : myBookings?.map(booking => {
                          return (
                            <div key={booking._id} className="space-y-4">
                              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h3 className="font-bold text-slate-800">{booking.equipment.equipmentName}</h3>
                                    <p className="text-sm text-slate-600">Booked by: {booking.farmer.name}</p>
                                    <p className="text-sm text-slate-600">{booking.startDate} - {booking.endDate}</p>
                                  </div>
                                  <span className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
                                    Active
                                  </span>
                                </div>

                                {/* Action Buttons for Owner */}
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                  {/* Verify Pickup Button */}
                                  {!booking.pickupConfirmed && booking.pickupImageUploaded && (
                                    <button
                                      onClick={() => {
                                        setOtpType('pickup');
                                        setShowOtpModal(true);
                                      }}
                                      className="py-2 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                                    >
                                      Verify Pickup OTP
                                    </button>
                                  )}

                                  {/* Verify Return Button */}
                                  {booking.pickupConfirmed && !booking.returnConfirmed && booking.returnImageUploaded && (
                                    <button
                                      onClick={() => {
                                        setOtpType('return');
                                        setShowOtpModal(true);
                                      }}
                                      className="py-2 px-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
                                    >
                                      Verify Return OTP
                                    </button>
                                  )}
                                </div>

                                {/* Status Messages */}
                                {!booking.pickupImageUploaded && (
                                  <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-700">⏳ Waiting for renter to upload pickup image</p>
                                  </div>
                                )}

                                {booking.pickupConfirmed && !booking.returnImageUploaded && (
                                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-700">✓ Equipment picked up. Waiting for return image.</p>
                                  </div>
                                )}

                                {booking.returnConfirmed && (
                                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-sm text-green-700">✓ Equipment returned successfully!</p>
                                  </div>
                                )}
                              </div>

                              {/* OTP Verification Modal */}
                              {showOtpModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowOtpModal(false)}></div>

                                  <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
                                    <button
                                      onClick={() => setShowOtpModal(false)}
                                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                                    >
                                      <X className="w-6 h-6" />
                                    </button>

                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                      Enter OTP from Renter
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-6">
                                      Ask the renter for the 6-digit OTP sent to their email
                                    </p>

                                    <div className="mb-6">
                                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        OTP Code *
                                      </label>
                                      <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 text-center text-2xl tracking-widest font-semibold"
                                      />
                                    </div>

                                    <button
                                      onClick={() => handleVerifyOtp(booking._id, otpType)}
                                      disabled={otp.length !== 6 || loading}
                                      className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {loading ? 'Verifying...' : 'Verify & Confirm'}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Showing earnings of farmer */}
                  {activeTab === 'earnings' && (
                    myBookings?.length == 0 ?
                      <div className=" col-span-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                        <div className="text-center py-12">
                          <HandCoins className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-600">No Earnings</p>
                        </div>
                      </div>
                      :
                      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Earnings Overview</h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white">
                            <p className="text-white/80 mb-2">Total Earnings</p>
                            <p className="text-4xl font-bold">₹{(farmer.earnings / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Showing health of equipments of farmer */}
                  {activeTab === 'health' && (
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                      <h2 className="text-2xl font-bold text-slate-800 mb-4">Equipment Health</h2>
                      <div className="space-y-4">
                        {myEquipments?.length == 0 ?
                          <div className=" col-span-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                            <div className="text-center py-12">
                              <Cross className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                              <p className="text-slate-600">No Equipments registered</p>
                            </div>
                          </div>
                          : myEquipments?.map(eq => (
                            <div key={eq._id} className="bg-slate-50 rounded-xl p-4">
                              <h3 className="font-bold text-slate-800 mb-3">{eq.equipmentName}</h3>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-sm text-slate-600">Usage Hours</p>
                                  <p className="text-xl font-bold text-slate-800">{eq.specs?.hours}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-sm text-slate-600">Last Service</p>
                                  <p className="text-lg font-bold text-slate-800">{eq.lastServiceDate}</p>
                                </div>
                              </div>
                              <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <p className="text-sm text-blue-700">
                                  <strong>Recommendation:</strong> Next service due in {eq.nextServiceDate}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* I Need Equipment Content */}
              {activeRole === 'need' && (
                <>
                  {/* Showing current rentals of farmer*/}
                  {activeTab === 'current' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-slate-800">Current Rentals</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {myRentals?.filter(r => ['active', 'confirmed'].includes(r.bookingStatus))?.length == 0 ?
                          <div className=" col-span-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                            <div className="text-center py-12">
                              <CircleAlert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                              <p className="text-slate-600">No Current Rentals</p>
                            </div>
                          </div>
                          :
                          myRentals?.filter(r => ['active', 'confirmed'].includes(r.bookingStatus))?.map(rental => (
                            <RentalCard key={rental._id} rental={rental} />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Showing past rentals of farmer*/}
                  {activeTab === 'past' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-slate-800">Past Rentals</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myRentals?.filter(r => r.bookingStatus === 'completed')?.length == 0 ?
                          <div className=" col-span-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6">
                            <div className="text-center py-12">
                              <CircleAlert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                              <p className="text-slate-600">No Past Rentals</p>
                            </div>
                          </div>
                          :
                          myRentals?.filter(r => r.bookingStatus === 'completed')?.map(rental => (
                            <PastRentalCard
                              rental={rental}
                              key={rental._id}
                              onReviewFarmer={(r) => openFarmerReviewModal(r)}
                              onReviewEquipment={(r) => openEquipmentReviewModal(r)}
                            />

                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Trust Community and Offline Contact */}
            {/* <div className="grid lg:grid-cols-1 gap-6">
              <TrustCommunity reviews={myReviews} />
            </div> */}

          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            farmer={farmer}
            setFarmer={setFarmer}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveProfile}
          />
        )}

        {/* Farmer Review Modal */}
        {showFarmerReviewModal && selectedRental && (
          <FarmerReviewModal
            rental={selectedRental}
            onClose={() => setShowFarmerReviewModal(false)}
            onSubmit={handleFarmerReviewSubmit}
          />
        )}

        {/* Equipment Review Modal */}
        {showEquipmentReviewModal && selectedRental && (
          <EquipmentReviewModal
            rental={selectedRental}
            onClose={() => setShowEquipmentReviewModal(false)}
            onSubmit={handleEquipmentReviewSubmit}
          />
        )}

      </div>
    );
  };
}

export default Profile;