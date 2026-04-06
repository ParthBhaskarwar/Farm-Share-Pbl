import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Tractor, LogOut } from 'lucide-react';
import api from '../../api/axios';
import { showError, showSuccess } from "./../../utils/toast";


const Navbar = ({setIsAuthenticated}) => {
    const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [farmer,setFarmer]=useState(null);

  const handleLogout = async () => {
  try {
    await api.post("/api/auth/logout"); 
    showSuccess('Logged out successfully');
    setIsAuthenticated(false); 
    navigate('/auth');
  } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
  }
};

  //for fetching profile
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
  },[]);

  const userName = farmer?.name?.split(' ')[0] || 'User';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              FarmShare
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-slate-700 hover:text-green-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/search" className="text-slate-700 hover:text-green-600 transition-colors font-medium">
              Search
            </Link>
            <Link to="/crop-calendar" className="text-slate-700 hover:text-green-600 transition-colors font-medium">
              Calendar
            </Link>
            <Link to="/about" className="text-slate-700 hover:text-green-600 transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-slate-700 hover:text-green-600 transition-colors font-medium">
              Contact
            </Link>
            <div className="flex items-center space-x-3">
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-700">{userName}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors font-medium">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-green-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{userName}</p>
                <p className="text-xs text-slate-600">{localStorage.getItem('userEmail')}</p>
              </div>
            </div>
            
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-slate-700 hover:text-green-600 transition-colors font-medium">Dashboard</Link>
            <Link to="/search" onClick={() => setIsOpen(false)} className="block py-2 text-slate-700 hover:text-green-600 transition-colors font-medium">Search</Link>
            <Link to="/crop-calendar" onClick={() => setIsOpen(false)} className="block py-2 text-slate-700 hover:text-green-600 transition-colors font-medium">Calendar</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block py-2 text-slate-700 hover:text-green-600 transition-colors font-medium">About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-slate-700 hover:text-green-600 transition-colors font-medium">Contact</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-3 bg-green-100 text-green-700 rounded-xl text-center font-medium hover:bg-green-200 transition-all">My Profile</Link>
            
            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-red-100 text-red-600 rounded-xl text-center font-medium hover:bg-red-200 transition-all flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;