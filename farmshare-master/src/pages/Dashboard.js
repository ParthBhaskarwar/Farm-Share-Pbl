import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Tractor, Search, Calendar, TrendingUp, MapPin, User, Phone, Clock, Pickaxe } from 'lucide-react';
import L from 'leaflet';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom markers
const ownerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const jobIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});



const Dashboard = () => {
  const [mapMode, setMapMode] = useState('owner'); // 'owner' or 'renter'
  const [ownerData, setOwnerData] = useState(null);
  const [renterData, setRenterData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMapData();
  }, [mapMode]);

  const fetchMapData = async () => {
    setLoading(true);
    try {
      if (mapMode === 'owner') {
        const { data } = await api.get('/api/farmer/todaysJobs');
        console.log(data);
        setOwnerData(data);
      } else {
        const { data } = await api.get('/api/farmer/myRentedLocations');
        console.log(data);
        setRenterData(data);
      }
    } catch (err) {
      console.error('Map data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

  const renderOwnerMap = () => {
    if (!ownerData || ownerData.jobs.length === 0) {
      return (
        <div className="h-96 flex items-center justify-center bg-slate-100 rounded-xl">
          <div className="text-center">
            <Tractor className="w-16 h-16 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No jobs scheduled for today</p>
            <p className="text-slate-500 text-sm">Your equipment bookings will appear here</p>
          </div>
        </div>
      );
    }

    const center = [ownerData.ownerLocation.lat, ownerData.ownerLocation.lng];

    return (
      <MapContainer center={center} zoom={12} className="h-96 rounded-xl z-0">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Owner Location */}
        <Marker position={center} icon={ownerIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-green-600">📍 Your Location</strong>
            </div>
          </Popup>
        </Marker>

        {/* Job Locations */}
        {ownerData.jobs.map((job) => (
          <React.Fragment key={job._id}>
            <Marker position={[job.location.lat, job.location.lng]} icon={jobIcon}>
              <Popup>
                <div className="space-y-1 min-w-[200px]">
                  <p className="font-bold text-green-600">🚜 {job.equipmentName}</p>
                  <div className="border-t border-slate-200 pt-2 space-y-1">
                    <p className="text-sm flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-600" /> <strong>Renter:</strong> {job.renterName}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3 text-blue-600" /> {job.renterPhone}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600" /> {job.renterVillage}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" /> {formatTime(job.startTime)} - {formatTime(job.endTime)}
                    </p>
                    {job.isTransportRequired && job.isOperatorRequired ? (
                      <p className="text-sm flex items-center gap-1">
                        <Pickaxe className="w-3 h-3 text-blue-600" /> Transport and Operation Service
                      </p>
                    ) : job.isTransportRequired ? (
                      <p className="text-sm flex items-center gap-1">
                        <Pickaxe className="w-3 h-3 text-blue-600" /> Transport Service
                      </p>
                    ) : job.isOperatorRequired ? (
                      <p className="text-sm flex items-center gap-1">
                        <Pickaxe className="w-3 h-3 text-blue-600" /> Operation Service
                      </p>
                    ) : null}
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Line from owner to job */}
            <Polyline
              positions={[center, [job.location.lat, job.location.lng]]}
              color="#10b981"
              weight={2}
              dashArray="5, 10"
            />
          </React.Fragment>
        ))}
      </MapContainer>
    );
  };

  const renderRenterMap = () => {
    if (!renterData || renterData.rentals.length === 0) {
      return (
        <div className="h-96 flex items-center justify-center bg-slate-100 rounded-xl">
          <div className="text-center">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No equipment rented for today</p>
            <p className="text-slate-500 text-sm">Your rental bookings will appear here</p>
          </div>
        </div>
      );
    }

    const center = [renterData.renterLocation.lat, renterData.renterLocation.lng];

    return (
      <MapContainer center={center} zoom={12} className="h-96 rounded-xl z-0">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Renter Location */}
        <Marker position={center} icon={ownerIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-green-600">📍 Your Location</strong>
            </div>
          </Popup>
        </Marker>

        {/* Equipment Locations */}
        {renterData.rentals.map((rental) => (
          <React.Fragment key={rental._id}>
            <Marker position={[rental.location.lat, rental.location.lng]} icon={jobIcon}>
              <Popup>
                <div className="space-y-1 min-w-[200px]">
                  <p className="font-bold text-blue-600">🚜 {rental.equipmentName}</p>
                  <div className="border-t border-slate-200 pt-2 space-y-1">
                    <p className="text-sm flex items-center gap-1">
                      <User className="w-3 h-3 text-green-600" /> <strong>Owner:</strong> {rental.ownerName}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3 text-green-600" /> {rental.ownerPhone}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-green-600" /> {rental.ownerVillage}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3 text-green-600" /> {formatTime(rental.startTime)} - {formatTime(rental.endTime)}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Line from renter to equipment */}
            <Polyline
              positions={[center, [rental.location.lat, rental.location.lng]]}
              color="#3b82f6"
              weight={2}
              dashArray="5, 10"
            />
          </React.Fragment>
        ))}
      </MapContainer>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your equipment needs and listings</p>
        </div>

        {/* Quick Actions Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/search"
            className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Search className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Search Equipment</h3>
            <p className="text-white/90">Find equipment near you</p>
          </Link>

          <Link
            to="/crop-calendar"
            className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Calendar className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Crop Calendar</h3>
            <p className="text-white/90">Plan your equipment needs</p>
          </Link>

          <Link
            to="/chatbot"
            className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <TrendingUp className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
            <p className="text-white/90">Get recommendations</p>
          </Link>
        </div>

        {/* Map Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-2 inline-flex space-x-2 border border-white/40">
            <button
              onClick={() => setMapMode('owner')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${mapMode === 'owner'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-white/50'
                }`}
            >
              <Tractor className="w-5 h-5" />
              <span>I Have Equipment</span>
            </button>

            <button
              onClick={() => setMapMode('renter')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${mapMode === 'renter'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-white/50'
                }`}
            >
              <Search className="w-5 h-5" />
              <span>I Want Equipment</span>
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">
              {mapMode === 'owner' ? "📍 Today's Jobs" : "🚜 Today's Rentals"}
            </h2>
            <div className="text-sm text-slate-600">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-3"></div>
                <p className="text-slate-600">Loading map data...</p>
              </div>
            </div>
          ) : mapMode === 'owner' ? (
            renderOwnerMap()
          ) : (
            renderRenterMap()
          )}

          {/* Map Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              <span className="text-slate-600">Your Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              <span className="text-slate-600">
                {mapMode === 'owner' ? 'Job Locations' : 'Equipment Locations'}
              </span>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;