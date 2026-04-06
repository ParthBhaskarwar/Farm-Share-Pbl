import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Clock } from 'lucide-react';
import api from '../../api/axios';
import { showError, showSuccess } from "./../../utils/toast";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Tractor Icon
const tractorIcon = new L.DivIcon({
  className: 'custom-tractor-icon',
  html: `<div style="background: #16a34a; border-radius: 50%; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3v18h18"></path>
      <path d="M7 12h10"></path>
      <circle cx="7" cy="17" r="2"></circle>
      <circle cx="17" cy="17" r="2"></circle>
      <path d="M3 7h4"></path>
      <path d="M17 7h4"></path>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Custom Farmer Icon
const farmerIcon = new L.DivIcon({
  className: 'custom-farmer-icon',
  html: `<div style="background: #2563eb; border-radius: 50%; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Component to fit map bounds
const FitBounds = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);

  return null;
};

const RouteMap = ({ equipment, coords, setCoords, setDistance, distance }) => {
  const [duration, setDuration] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Equipment location (from coordinates)
  const equipmentLocation = equipment?.location?.coordinates
    ? [equipment.location.coordinates[1], equipment.location.coordinates[0]] // [lat, lng]
    : null;

  // ✅ FIX: Convert coords object to [lat, lng] array
  const farmerPos = coords ? [coords.lat, coords.lng] : null;

  // Fetch route when coords or equipment changes
  useEffect(() => {
  if (!farmerPos || !equipmentLocation) return;

    const fetchRoute = async () => {
      setLoadingRoute(true);
      try {
        const res = await api.post("/distance", {
          coordinates: [
            [farmerPos[1], farmerPos[0]],
            [equipmentLocation[1], equipmentLocation[0]]
          ],
          radiuses: [5000, 5000] // Increase search radius to 5km for both points
        });

        const feature = res.data.features[0];

        const coords1 = feature.geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );

        setRouteCoordinates(coords1);

        const { distance, duration } = feature.properties.summary;
        setDistance((distance / 1000).toFixed(2));
        setDuration(Math.round(duration / 60));

      } catch (err) {
        console.error("Route fetch error:", err);
        // Fallback to straight line distance if routing fails
        setRouteCoordinates([farmerPos, equipmentLocation]);
        
        // Calculate Haversine distance (straight line)
        const R = 6371; // Earth's radius in km
        const dLat = (equipmentLocation[0] - farmerPos[0]) * Math.PI / 180;
        const dLon = (equipmentLocation[1] - farmerPos[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(farmerPos[0] * Math.PI / 180) * Math.cos(equipmentLocation[0] * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        setDistance(d.toFixed(2));
        setDuration(0); // Cannot estimate duration for straight line
      } finally {
        setLoadingRoute(false);
      }
    };

  fetchRoute();
}, [equipment?._id]); // ✅ ONLY CHANGE // ✅ FIX: Proper dependencies

  // Handle location capture
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser ❌');
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(location);
        setLocationLoading(false);
        showSuccess('Location captured successfully! ✅');
      },
      (error) => {
        setLocationLoading(false);
        let message = 'Unable to get location';
        if (error.code === 1) message = 'Location permission denied. Please enable location access.';
        if (error.code === 2) message = 'Location unavailable. Try again.';
        if (error.code === 3) message = 'Location request timed out.';
        showError(message + ' ❌');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // If no farmer location, show "Use My Location" button
  if (!farmerPos) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-bold">Equipment Location</h3>
              <p className="text-green-100 text-sm">View distance and route from your location</p>
            </div>
          </div>
        </div>

        {/* Location Button */}
        <div className="h-96 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-4">
              <MapPin className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Find Distance to Equipment</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              Share your location to see the exact route and distance to this equipment
            </p>
            <button
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
            >
              <Navigation className={`w-5 h-5 ${locationLoading ? 'animate-pulse' : ''}`} />
              <span>{locationLoading ? 'Getting Location...' : 'Use My Current Location'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no equipment location, show error
  if (!equipmentLocation) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 p-8 text-center">
        <p className="text-slate-600">Equipment location not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-bold">Equipment Location & Route</h3>
              <p className="text-green-100 text-sm">Driving route from your location</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-sm text-green-100">Distance</p>
              <p className="text-2xl font-bold">{distance || 0} km</p>
            </div>
            {duration > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <p className="text-sm text-green-100">Duration</p>
                <p className="text-2xl font-bold flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {duration} min
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-96 relative">
        {loadingRoute && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[1000] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-3"></div>
              <p className="text-slate-600 font-medium">Loading route...</p>
            </div>
          </div>
        )}

        <MapContainer
          center={farmerPos}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Farmer Location Marker */}
          <Marker position={farmerPos} icon={farmerIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-blue-600">Your Location</p>
                <p className="text-sm text-slate-600">Starting point</p>
              </div>
            </Popup>
          </Marker>

          {/* Equipment Location Marker */}
          <Marker position={equipmentLocation} icon={tractorIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-green-600">{equipment?.equipment?.equipmentName}</p>
                <p className="text-sm text-slate-600">{equipment?.equipment?.equipmentType}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Owner: {equipment?.farmer?.name}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Route Line */}
          {routeCoordinates.length > 0 && (
            <Polyline
              positions={routeCoordinates}
              color="#16a34a"
              weight={4}
              opacity={0.8}
            />
          )}

          {/* Fit bounds */}
          <FitBounds positions={routeCoordinates.length > 0 ? routeCoordinates : [farmerPos, equipmentLocation]} />
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 p-4 border-t border-slate-200">
        <div className="flex items-center justify-around text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-700 font-medium">Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-slate-700 font-medium">Driving Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 3v18h18"></path>
                <circle cx="7" cy="17" r="2"></circle>
                <circle cx="17" cy="17" r="2"></circle>
              </svg>
            </div>
            <span className="text-slate-700 font-medium">Equipment Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;