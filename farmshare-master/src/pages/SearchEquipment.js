import React, { useEffect, useState } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import SmartSearchInputs from '../components/SearchEquipment/SmartSearchInputs';
import HorizontalFiltersBar from '../components/SearchEquipment/HorizontalFiltersBar';
import EquipmentCard from '../components/SearchEquipment/EnhancedEquipmentCard';
import api from './../api/axios';
import { showError, showSuccess } from '../utils/toast';

const SearchEquipment = ({coords, setCoords}) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [locationType, setLocationType] = useState('registered'); // 'registered' or 'current'
  const [locationLoading, setLocationLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    crop: '',
    process: '',
    equipment: ''
  });

  const [filters, setFilters] = useState({
    maxDistance: 100,
    priceRange: [0, 20000],
    conditions: ['Excellent', 'Good', 'Fair'],
    insuranceOnly: false
  });

  const [sortBy, setSortBy] = useState('distance');
  const [equipment, setEquipment] = useState([]);

   const fetchEquipment = async () => {
      try {
        const params = {
          latitude: coords.lat,
          longitude: coords.lng
        };

        // Add optional filters
        if (searchParams.equipment) params.equipmentType = searchParams.equipment;
        if (searchParams.crop) params.crop = searchParams.crop;        // ✅ Add this
if (searchParams.process) params.process = searchParams.process;
        if (filters.maxDistance) params.distance = filters.maxDistance;
        if (filters.priceRange) params.priceRange = `${filters.priceRange[0]}-${filters.priceRange[1]}`;
        if (filters.conditions.length === 1) params.condition = filters.conditions[0];
        if (filters.insuranceOnly) params.hasInsurance = 'true';
        
        // Add sorting
        if (sortBy === 'price-low') params.sort = 'price-low';
        else if (sortBy === 'price-high') params.sort = 'price-high';
        else if (sortBy === 'rating') params.sort = 'highly-rated';
        else if (sortBy === 'distance') params.sort = 'distance';


        const response = await api.get('/api/equipment/search', { params });
        console.log(params);
        console.log(response.data);
        setEquipment(response.data.equipment || []);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
        setEquipment([]);
      }
    };

  // Fetch farmer profile
  // Fetch farmer profile
useEffect(() => {
  const fetchFarmer = async () => {
    try {
      const { data } = await api.get('/api/farmer/profile');
      setFarmer(data.farmer);
      // Set registered location as default ONLY if coords is null
      if (data.farmer?.location?.coordinates && !coords) {
        setCoords({
          lat: data.farmer.location.coordinates[1],
          lng: data.farmer.location.coordinates[0]
        });
      }
    } catch (err) {
      console.error('Failed to fetch farmer profile:', err);
    }
  };
  fetchFarmer();
}, []); 

  // Fetch equipment when search is triggered or filters change
  useEffect(() => {
    if (!hasSearched || !coords) return;

    fetchEquipment();
  }, [hasSearched, filters, sortBy, searchParams, coords]);

  const handleUseRegisteredLocation = () => {
    if (farmer && farmer.location) {
      setCoords({
        lat: farmer.location.coordinates[1],
        lng: farmer.location.coordinates[0]
      });
      setLocationType('registered');
      showSuccess('Using registered location! ✅');
    } else {
      showError('Registered location not available! 📍');
    }
  };

  const handleUseCurrentLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationType('current');
        setLocationLoading(false);
        showSuccess('Using current location! ✅');
      },
      (error) => {
        setLocationLoading(false);
        let message = 'Unable to get location';
        if (error.code === 1) message = 'Location permission denied.';
        if (error.code === 2) message = 'Location unavailable.';
        if (error.code === 3) message = 'Location request timed out.';
        showError(message + ' ❌');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = (params) => {
  console.log("PARENT RECEIVED:", params);
  setSearchParams(params);
  setHasSearched(true);
};

  const handleReset = () => {
    setHasSearched(false);
    setSearchParams({ crop: '', process: '', equipment: '' });
    setFilters({
      maxDistance: 100,
      priceRange: [0, 20000],
      conditions: ['Excellent', 'Good', 'Fair'],
      insuranceOnly: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Find Farm Equipment</h1>
          <p className="text-green-100 text-lg">Search by crop, process, or equipment name</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Location Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleUseRegisteredLocation}
            disabled={!farmer?.location}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              locationType === 'registered'
                ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-green-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <MapPin className="w-5 h-5" />
            Registered Location
          </button>

          <button
            onClick={handleUseCurrentLocation}
            disabled={locationLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              locationType === 'current'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {locationLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Navigation className="w-5 h-5" />
            )}
            Current Location
          </button>
        </div>

        <div className="mt-10">
          {/* Smart Search Inputs */}
          <SmartSearchInputs
            onSearch={handleSearch}
            onReset={handleReset}
            initialParams={searchParams}
            coords={coords}
            locationType={locationType}
            locationLoading={locationLoading}
          />
        </div>

        {/* Results Section */}
        {hasSearched ? (
          <div className="mt-8">
            {/* Horizontal Filters Bar */}
            <HorizontalFiltersBar
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resultCount={equipment.length}
              searchParams={searchParams}
            />

            {/* Equipment Grid */}
            {equipment.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No equipment found</h3>
                <p className="text-slate-600">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map(eq => (
                  <EquipmentCard key={eq._id} equipment={eq} id={eq._id} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty State - Before Search */
          <div className="mt-16 text-center">
            <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
              <Search className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Ready to find equipment?</h2>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              Select your crop, process, or equipment type above and click <span className="font-semibold text-green-600">"Search Equipment"</span> to start!
            </p>

            {/* Quick Tips */}
            <div className="max-w-2xl mx-auto grid md:grid-cols-3 gap-4 mt-12">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                <div className="text-3xl mb-3">🌾</div>
                <h3 className="font-semibold text-slate-800 mb-2">Search by Crop</h3>
                <p className="text-sm text-slate-600">Select your crop and we'll suggest equipment</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="font-semibold text-slate-800 mb-2">Or by Process</h3>
                <p className="text-sm text-slate-600">Choose ploughing, sowing, or harvesting</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                <div className="text-3xl mb-3">🚜</div>
                <h3 className="font-semibold text-slate-800 mb-2">Direct Equipment</h3>
                <p className="text-sm text-slate-600">Know what you need? Search directly!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchEquipment;