import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import api from './../api/axios';
import { showError, showSuccess } from "../utils/toast";
import { Tractor, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Check, ArrowLeft, Globe, Sprout, ChevronRight, ChevronLeft, CheckCircle, Shield, KeyRound } from 'lucide-react';
import ForgotPasswordModal from '../components/Auth/Forgotpasswordmodal';

const Auth = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // Steps: 1=Email Verify, 2=Basic Info, 3=Preferences, 4=Password
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showResetSuccessMessage, setShowResetSuccessMessage] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [signupToken, setSignupToken] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    village: '',
    district: '',
    preferredLanguage: '',
    preferredCrops: [],
    notificationPreference: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: false,
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    if (location.state?.resetSuccess) {
      setShowResetSuccessMessage(true);
      window.history.replaceState({}, document.title);
      setTimeout(() => setShowResetSuccessMessage(false), 5000);
    }
  }, [location]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });
      showSuccess('Logged in successfully');
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/start-signup", { email: formData.email });
      setOtpSent(true);
      setResendTimer(60);
      showSuccess("Verification code sent to your email!");
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/verify-email", {
        email: formData.email,
        otp: otp
      });
      if (response.data.token) {
        setSignupToken(response.data.token);
        localStorage.setItem('signupToken', response.data.token);
      }
      setSignupStep(2);
      showSuccess("Email verified successfully!");
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoNext = () => {
    if (!formData.name || !formData.phone || !formData.village || !formData.district || !formData.latitude || !formData.longitude) {
      showError("Please fill all required fields");
      return;
    }
    setSignupStep(3);
  };

  const handlePreferencesNext = () => {
    if (!formData.preferredLanguage || !formData.notificationPreference || formData.preferredCrops.length === 0) {
      showError("Please complete all preference fields");
      return;
    }
    setSignupStep(4);
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.passwordConfirm) {
      showError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      showError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      showError("Please agree to Terms & Conditions");
      setLoading(false);
      return;
    }

    try {
      const token = signupToken || localStorage.getItem('signupToken');
      await api.post("/api/auth/complete-signup", {
        name: formData.name,
        phone_number: formData.phone,
        village: formData.village,
        district: formData.district,
        preferredLanguage: formData.preferredLanguage,
        preferredCrops: formData.preferredCrops,
        notificationPreference: formData.notificationPreference,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        latitude: formData.latitude,
        longitude: formData.longitude
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCropToggle = (crop) => {
    setFormData(prev => ({
      ...prev,
      preferredCrops: prev.preferredCrops.includes(crop)
        ? prev.preferredCrops.filter(c => c !== crop)
        : [...prev.preferredCrops, crop]
    }));
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await api.post("/api/auth/start-signup", { email: formData.email });
      setResendTimer(60);
      showSuccess("New verification code sent!");
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetSignupForm = () => {
    setSignupStep(1);
    setOtpSent(false);
    setOtp('');
    setSignupToken('');
    localStorage.removeItem('signupToken');
    setFormData({
      email: '',
      name: '',
      phone: '',
      village: '',
      district: '',
      preferredLanguage: '',
      preferredCrops: [],
      notificationPreference: '',
      password: '',
      passwordConfirm: '',
      agreeTerms: false,
      latitude: '',
      longitude: ''
    });
  };

 const handleGoogleLogin = async (credentialResponse) => {
  try {
    const token = credentialResponse.credential;
    const res = await api.post("/api/auth/google-login", { token });

    if (res.status === 200) {
      showSuccess('Logged in successfully');
      setIsAuthenticated(true);   // ← only set AFTER confirming success
      navigate("/dashboard");
    }
  } catch (err) {
    if (err.response?.status === 404) {
      showError("Email not registered. Please sign up first.");
      return;
    }
    showError(err.response?.data?.message || "Google login failed");
  }
};

  const cropOptions = ['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Pulses'];
  const stepLabels = ['Verify Email', 'Basic Info', 'Preferences', 'Password'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <button onClick={() => navigate('/')} className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-slate-600 hover:text-green-600 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      {showResetSuccessMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl shadow-lg px-6 py-4 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-semibold">Password Reset Successful!</p>
              <p className="text-green-700 text-sm">You can now login with your new password.</p>
            </div>
          </div>
        </div>
      )}

      <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 text-center lg:text-left space-y-6 p-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center">
              <Tractor className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">FarmShare</h1>
          </div>

          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
              {isLogin ? 'Welcome Back!' : 'Join 10,000+ Farmers'}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {isLogin
                ? 'Continue your journey to smarter, more affordable farming through equipment sharing.'
                : 'Start saving money and earning extra income by sharing agricultural equipment with trusted farmers in your community.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <Shield className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-slate-800 mb-1">Verified Community</h3>
              <p className="text-sm text-slate-600">All farmers are verified with phone and ID</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <Check className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-slate-800 mb-1">Fully Insured</h3>
              <p className="text-sm text-slate-600">Every rental protected with insurance</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <Globe className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-slate-800 mb-1">Smart Pricing</h3>
              <p className="text-sm text-slate-600">AI-powered dynamic pricing for fairness</p>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-8 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">10K+</div>
              <div className="text-sm text-slate-600">Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">5K+</div>
              <div className="text-sm text-slate-600">Equipment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.8★</div>
              <div className="text-sm text-slate-600">Rating</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[480px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          <div className="flex gap-2 mb-8 bg-slate-100 p-2 rounded-xl">
            <button
              onClick={() => { setIsLogin(true); resetSignupForm(); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${isLogin ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); resetSignupForm(); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${!isLogin ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Sign Up
            </button>
          </div>

          {!isLogin && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step, index) => (
                  <React.Fragment key={step}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${signupStep === step ? 'bg-green-600 text-white' : signupStep > step ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'
                      }`}>
                      {signupStep > step ? <Check className="w-4 h-4" /> : step}
                    </div>
                    {index < 3 && <div className={`flex-1 h-1 mx-2 ${signupStep > step ? 'bg-green-600' : 'bg-slate-200'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs">
                {stepLabels.map((label, index) => (
                  <span key={index} className={`flex-1 text-center ${signupStep === index + 1 ? 'text-green-600 font-medium' : 'text-slate-500'}`} style={{ fontSize: '10px' }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800">
              {isLogin ? 'Login to Your Account' :
                signupStep === 1 ? 'Verify Your Email' :
                  signupStep === 2 ? 'Basic Information' :
                    signupStep === 3 ? 'Set Your Preferences' : 'Create Password'}
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              {isLogin ? 'Enter your credentials to continue' :
                signupStep === 1 ? 'We\'ll send a verification code to your email' :
                  signupStep === 2 ? 'Tell us about yourself' :
                    signupStep === 3 ? 'Customize your experience' : 'Secure your account with a strong password'}
            </p>
          </div>

          {/* LOGIN FORM */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button type="button" onClick={() => setIsForgotPasswordOpen(true)} className="text-sm text-green-600 hover:text-green-700 font-medium">Forgot password?</button>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : 'Login to Dashboard'}
              </button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white/80 text-slate-600">Or continue with</span></div>
              </div>


              {/* With this */}
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => showError("Google login failed")}
                    use_fedcm_for_prompt={true}
                    width="400"
                    type="standard"
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    logo_alignment="left"
                    text="signin_with"
                  />
                  
                </div>
                <button type="button" className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2">
                  <span>📱</span><span>Phone</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 1: Email OTP */}
          {!isLogin && signupStep === 1 && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                    {loading ? 'Sending Code...' : <><Mail className="w-5 h-5" /><span>Send Verification Code</span></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-green-800 font-medium">Code sent to {formData.email}</p>
                        <p className="text-xs text-green-700 mt-1">Please check your inbox and enter the 6-digit code below</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Verification Code *</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit code" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-center text-2xl tracking-widest font-semibold" maxLength={6} required />
                    </div>
                  </div>
                  <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                    {loading ? 'Verifying...' : <><Shield className="w-5 h-5" /><span>Verify Email</span></>}
                  </button>
                  <div className="text-center">
                    <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || loading} className="text-sm text-green-600 hover:text-green-700 font-medium disabled:text-slate-400 disabled:cursor-not-allowed">
                      {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend verification code'}
                    </button>
                  </div>
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="w-full text-sm text-slate-600 hover:text-slate-800">← Change email address</button>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: Basic Info */}
          {!isLogin && signupStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 1234567890" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Village *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" name="village" value={formData.village} onChange={handleChange} placeholder="Village" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">District *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required />
                  </div>
                </div>
              </div>
              {/* Location Capture - ADD THIS */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  📍 Current Location *
                </label>

                {formData.latitude && formData.longitude ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800 font-semibold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Location Captured
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Lat: {parseFloat(formData.latitude).toFixed(6)}, Lng: {parseFloat(formData.longitude).toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setFormData(prev => ({
                            ...prev,
                            latitude: pos.coords.latitude.toString(),
                            longitude: pos.coords.longitude.toString()
                          }));
                          showSuccess('Location captured! ✅');
                        },
                        () => showError('Failed to get location ❌'),
                        { enableHighAccuracy: true }
                      );
                    }}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Capture Current Location</span>
                  </button>
                )}
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => { setSignupStep(1); setOtpSent(false); setOtp(''); }} className="flex-1 py-3 px-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2">
                  <ChevronLeft className="w-5 h-5" /><span>Back</span>
                </button>
                <button type="button" onClick={handleBasicInfoNext} className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                  <span>Next Step</span><ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Preferences */}
          {!isLogin && signupStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Language *</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors appearance-none" required>
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notification Preference *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select name="notificationPreference" value={formData.notificationPreference} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors appearance-none" required>
                    <option value="">Select Notification Preference</option>
                    <option value="app">App Notifications</option>
                    <option value="sms">SMS Messages</option>
                    <option value="call">Phone Calls</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Crops * (Select at least one)</label>
                <div className="grid grid-cols-2 gap-2">
                  {cropOptions.map((crop) => (
                    <button key={crop} type="button" onClick={() => handleCropToggle(crop)} className={`px-4 py-2 rounded-lg border-2 transition-all ${formData.preferredCrops.includes(crop) ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-green-300'}`}>
                      <div className="flex items-center justify-between">
                        <span>{crop}</span>
                        {formData.preferredCrops.includes(crop) && <Check className="w-4 h-4 text-green-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setSignupStep(2)} className="flex-1 py-3 px-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2">
                  <ChevronLeft className="w-5 h-5" /><span>Back</span>
                </button>
                <button type="button" onClick={handlePreferencesNext} className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                  <span>Next Step</span><ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Password */}
          {!isLogin && signupStep === 4 && (
            <form onSubmit={handleCompleteSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required minLength={8} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Minimum 8 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} placeholder="Confirm your password" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" required />
                </div>
                {formData.password && formData.passwordConfirm && (
                  <p className={`text-xs mt-1 ${formData.password === formData.passwordConfirm ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.password === formData.passwordConfirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="w-4 h-4 mt-1 text-green-600 rounded focus:ring-green-500" required />
                <span className="text-sm text-slate-600">I agree to the <a href="#" className="text-green-600 hover:text-green-700 font-medium">Terms & Conditions</a> and <a href="#" className="text-green-600 hover:text-green-700 font-medium">Privacy Policy</a></span>
              </label>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setSignupStep(3)} className="flex-1 py-3 px-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2">
                  <ChevronLeft className="w-5 h-5" /><span>Back</span>
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                  {loading ? 'Creating Account...' : <><Check className="w-5 h-5" /><span>Create Account</span></>}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { if (isLogin) { setIsLogin(false); resetSignupForm(); } else { setIsLogin(true); resetSignupForm(); } }} className="text-green-600 hover:text-green-700 font-semibold">
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;