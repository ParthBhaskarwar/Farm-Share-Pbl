import React, { useState, useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./api/axios";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ComboDetails from './pages/ComboDetails';
import CombosListing from './pages/CombosListing';
import SearchEquipment from './pages/SearchEquipment';
import EquipmentDetails from './pages/EquipmentDetails';
import CropCalendar from './pages/CropCalendar';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import AIChatbot from './components/Layout/AIChatbot';
import AddEquipmentPage from './components/Profile/AddEquipment';
import ResetPasswordPage from './components/Auth/Resetpasswordpage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [coords, setCoords] = useState(null);
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/api/farmer/me");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      );
    }
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  // Public Route Component (redirect to dashboard if already logged in)
  const PublicRoute = ({ children }) => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      );
    }
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <>
    <Router>
      <Routes>
        {/* Landing Page - First page users see */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />

        {/* Auth Page - Login/Signup */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth setIsAuthenticated={setIsAuthenticated} />
            </PublicRoute>
          }
        />

        {/* Reset Password Page - PUBLIC ROUTE (accessible via email link without login) */}
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

        {/* Protected Routes - With Navbar/Footer - Require Login */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <Navbar setIsAuthenticated={setIsAuthenticated}/>
                <main className="flex-grow pt-16">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/combos" element={<CombosListing />} />
                    <Route path="/combos/:comboId" element={<ComboDetails />} />
                    <Route path="/search" element={<SearchEquipment coords={coords} setCoords={setCoords}/>} />
                    <Route path="/equipment/:id" element={<EquipmentDetails coords={coords} setCoords={setCoords}/>} />
                    <Route path="/crop-calendar" element={<CropCalendar />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/equipment/add" element={<AddEquipmentPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* Catch all - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
                <Footer />
                <AIChatbot />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;