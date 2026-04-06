import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-2 rounded-xl">
                <Tractor className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">FarmShare</span>
            </div>
            <p className="text-slate-300 text-sm">
              Connecting farmers with equipment. Making agriculture affordable and accessible for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-300 hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-slate-300 hover:text-green-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/search" className="text-slate-300 hover:text-green-400 transition-colors">Search Equipment</Link></li>
              <li><Link to="/crop-calendar" className="text-slate-300 hover:text-green-400 transition-colors">Crop Calendar</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-300 hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-green-400 transition-colors">Contact</Link></li>
              <li><a href="/about" className="text-slate-300 hover:text-green-400 transition-colors">FAQ</a></li>
              <li><a href="/about" className="text-slate-300 hover:text-green-400 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            {/* Contact */}
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">1800-FARM-HELP</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@farmshare.com</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 mt-1" />
                <span className="text-sm">Nagpur, Maharashtra, India</span>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-green-600 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-green-600 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-green-600 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-green-600 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 FarmShare. All rights reserved. Made with ❤️ for Farmers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;