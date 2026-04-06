import React, { useState, useEffect } from 'react';
import { Search, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { showError } from '../../utils/toast';

const SmartSearchInputs = ({
  onSearch,
  onReset,
  initialParams,
  coords
}) => {
  const [crop, setCrop] = useState('');
  const [process, setProcess] = useState('');
  const [equipment, setEquipment] = useState('');



  // Dynamic data from APIs
  const [crops, setCrops] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [types, setTypes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (initialParams) {
      setCrop(initialParams.crop || '');
      setProcess(initialParams.process || '');
      setEquipment(initialParams.equipment || '');
    }
  }, [initialParams]);

  // Fetch crops and processes on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cropsRes, processesRes, typesRes] = await Promise.all([
          api.get('/api/equipment/catalog/crops'),
          api.get('/api/equipment/catalog/processes'),
          api.get('/api/equipment/catalog/types')

        ]);

        setCrops(cropsRes.data.crops || []);
        setProcesses(processesRes.data.processes || []);
        setTypes(typesRes.data.types || []);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchOptions();
  }, []);

  // Fetch suggestions when crop or process changes
  useEffect(() => {
    if (!crop && !process) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const params = {};
        if (crop) params.crop = crop;
        if (process) params.process = process;

        const response = await api.get('/api/equipment/catalog/suggestions', { params });
        setSuggestions(response.data.suggestions || []);
      } catch (err) {
        showError(err.response?.data?.message || "Something went wrong");
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [crop, process]);

  const handleSubmit = () => {
    if (!coords) {
      showError('Location not available! 📍');
      return;
    }
    console.log("SEARCH CLICKED:", { crop, process, equipment });

    onSearch({ crop, process, equipment });
  };

  const handleClear = () => {
    setCrop('');
    setProcess('');
    setEquipment('');
    setSuggestions([]);
    onReset();
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 + mt-8">
      <div className="space-y-6">

        {/* Location Toggle Button */}


        {/* Row 1: Crop, Process, Equipment */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Crop */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              🌾 Crop <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select crop</option>
              {crops.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Process */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              ⚙️ Process <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select process</option>
              {processes.map((p, i) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              🚜 Equipment <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="Search by name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select equipment</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && !equipment && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Suggested Equipment</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEquipment(suggestion)}
                  className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-full text-sm font-semibold hover:bg-green-100 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!coords}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
            <span>Search Equipment</span>
          </button>
          <Link to="/combos"
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Looking for combos?</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchInputs;