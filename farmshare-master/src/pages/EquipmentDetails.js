import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EquipmentHero from '../components/EquipmentDetails/EquipmentHero';
import EquipmentHealthCard from '../components/EquipmentDetails/EquipmentHealthCard';
import OwnerProfileCard from '../components/EquipmentDetails/OwnerProfileCard';
import PricingBookingCard from '../components/EquipmentDetails/PricingBookingCard';
import ReviewsTrust from '../components/EquipmentDetails/ReviewsTrust';
import SimilarEquipment from '../components/EquipmentDetails/SimilarEquipment';
import RouteMap from '../components/EquipmentDetails/RouteMap';
import api from './../api/axios';
import { showError } from '../utils/toast';

const EquipmentDetails = ({coords,setCoords}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [distance, setDistance] = useState(0);
  const [searchedEquipment, setSearchedEquipment] = useState(null);
  const [ownerTrustScore, setOwnerTrustScore] = useState(0);

  //Fetching Searched equipment
  useEffect(() => {
    const getEquipment = async () => {
      try {
        const response = await api.get(`/api/equipment/${id}`);
        setSearchedEquipment(response.data.equipment);
      } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
      }
    };
    getEquipment();
  }, [id]);

  //Fetching Owner Trust
  useEffect(() => {
    if (!searchedEquipment?.farmer?._id) return;

    const fetchOwnerTrust = async () => {
      try {
        const response = await api.get(
          `/api/farmer/ownerTrust/${searchedEquipment.farmer._id}`
        );
        setOwnerTrustScore(response.data.ownerTrustStats.trustScore);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchOwnerTrust();
  }, [searchedEquipment]);

  // Handler for location capture from RouteMap

  //No Equipment Found
  if (!searchedEquipment) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Equipment not found</h2>
          <button
            onClick={() => navigate('/search')}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-600 hover:text-green-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Search</span>
        </button>

        {/* 1️⃣ Hero Section */}
        <EquipmentHero equipment={searchedEquipment} />

        {/* 2️⃣ Split Section - Health & Owner */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {searchedEquipment && (
            <EquipmentHealthCard equipment={searchedEquipment} equipmentId={searchedEquipment._id} />
          )}
          <OwnerProfileCard
            owner={searchedEquipment.farmer}
            ownerTrustScore={ownerTrustScore}
          />
        </div>

        {/* 4️⃣ Route Map Section */}

        <div className="mb-8">
          <RouteMap
            equipment={searchedEquipment}
            coords={coords}
            setCoords={setCoords}
            distance={distance}
            setDistance={setDistance}
          />
        </div>

        {/* 3️⃣ Pricing & Booking Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <ReviewsTrust
              currentEquipmentId={searchedEquipment._id}
              ownerTrustScore={ownerTrustScore}
            />
          </div>
          <div className="lg:col-span-1">
            <PricingBookingCard
              currentEquipmentId={searchedEquipment._id}
              equipment={searchedEquipment}
              distance={distance}
            />
          </div>
        </div>

        {/* 5️⃣ Similar Equipment */}
        <SimilarEquipment
          currentEquipmentId={searchedEquipment._id}
          equipment={searchedEquipment}
        />
      </div>
    </div>
  );
};

export default EquipmentDetails;