import React, { useEffect, useState } from 'react';
import { Activity, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import { showError, showSuccess } from "./../../utils/toast";

const EquipmentHealthCard = ({ equipment, equipmentId }) => {
  // Calculate health score (0-100)
  const [myHealth, setMyHealth] = useState({
    totalScore: 0,
    comments: []
  });

  //for fetching health of equipment
  useEffect(() => {
    const fetchMyHealth = async () => {
      try {
        const response = await api.get(`/api/equipment/health/${equipmentId}`);
        setMyHealth(response.data.health);
      } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchMyHealth();
  }, [equipmentId]);

  const healthScore = myHealth.totalScore;

  //for getting health status
  const getHealthStatus = () => {
    if (healthScore >= 85) return {
      status: 'Excellent',
      color: 'from-green-600 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
      icon: CheckCircle
    };
    if (healthScore >= 60) return {
      status: 'Fair',
      color: 'from-yellow-600 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-700',
      icon: AlertCircle
    };
    return {
      status: 'Not Recommended',
      color: 'from-red-600 to-orange-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      icon: AlertCircle
    };
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-green-200 overflow-hidden shadow-xl h-full">
      {/* Header with Gradient */}
      <div className={`bg-gradient-to-r ${healthStatus.color} p-6 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Equipment Health</h2>
          <Activity className="w-8 h-8" />
        </div>
        <p className="text-white/90">Comprehensive maintenance status</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Overall Health Status - BIG */}
        <div className={`${healthStatus.bgColor} rounded-2xl p-6 border-2 ${healthStatus.borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <StatusIcon className={`w-8 h-8 ${healthStatus.textColor}`} />
              <div>
                <p className="text-sm text-slate-600 font-medium">Overall Status</p>
                <p className={`text-3xl font-bold ${healthStatus.textColor}`}>{healthStatus.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 font-medium">Health Score</p>
              <p className={`text-4xl font-bold ${healthStatus.textColor}`}>{healthScore}</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="relative h-3 bg-white rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${healthStatus.color} transition-all duration-500`}
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Last Service */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-600 font-medium">Last Service</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{equipment.lastServiceDate}</p>
          </div>
          {/* Next Service */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-600 font-medium">Next Service</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{equipment.nextServiceDate}</p>
          </div>
        </div>
        
        {/* Past History Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Purchase Year */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-slate-600 font-medium">Year</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{equipment.specs.year} </p>
          </div>
          {/*Usuage Hours*/}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-slate-600 font-medium">Usage Hours</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{equipment.specs.hours} hrs</p>
          </div>
        </div>

        {/* Breakdown History */}
        <div>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-slate-600" />
            <span>Inspection Results</span>
          </h3>
          <div className="space-y-2">
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 space-y-3">
              {myHealth.comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-snug">
                    {comment}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentHealthCard;