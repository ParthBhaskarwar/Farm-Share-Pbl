import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Users, Shield, TrendingUp, Zap, MapPin, DollarSign, Clock, Star, ChevronRight, Check } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: MapPin,
      title: 'Find Equipment Nearby',
      description: 'Discover available equipment within kilometers of your farm',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      icon: DollarSign,
      title: 'Dynamic Pricing',
      description: 'Fair prices that adjust based on demand and your trust score',
      color: 'from-green-600 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'Every rental protected with comprehensive insurance coverage',
      color: 'from-purple-600 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Book Anytime',
      description: 'Rent by hour, day, or week - flexible options for every need',
      color: 'from-orange-600 to-red-500'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: '10,000+ verified farmers helping each other succeed',
      color: 'from-indigo-600 to-blue-500'
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Smart recommendations for equipment and crop planning',
      color: 'from-yellow-600 to-orange-500'
    }
  ];

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-2 rounded-xl shadow-lg">
                <Tractor className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                FarmShare
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-700 hover:text-green-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-700 hover:text-green-600 transition-colors font-medium">How it Works</a>
              <button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute bottom-20 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"
            style={{ transform: `translateY(${scrollY * -0.2}px)`, animationDelay: '1s' }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block animate-float">
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                  🌾 India's #1 Farm Equipment Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-slate-800 leading-tight">
                Share Equipment.
                <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent mt-2">
                  Grow Together.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
                Connect with 10,000+ farmers to rent or share agricultural equipment. 
                <span className="font-semibold text-green-600"> Save up to 70%</span> on equipment costs.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="group bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Start Free Today</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Content - Floating Cards */}
            <div className="relative h-[600px] hidden lg:block">
              {/* Equipment Card 1 */}
              <div 
                className="absolute top-0 right-0 w-72 animate-float"
                style={{ animationDelay: '0s' }}
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/40">
                  <img 
                    src="/images/John Deere Tractors.jpg" 
                    alt="Tractor" 
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800">John Deere Tractor</h3>
                  </div>
                </div>
              </div>

              {/* Equipment Card 2 */}
              <div 
                className="absolute bottom-20 left-0 w-72 animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/40">
                  <img 
                    src="/images/Combine Harvester.jpg" 
                    alt="Harvester" 
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800">Combine Harvester</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Why Choose <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">FarmShare?</span>
            </h2>
            <p className="text-xl text-slate-600">Everything you need to share and rent equipment safely</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-green-600 to-emerald-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-white/90">Start renting or earning in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create Account', description: 'Sign up free in 30 seconds. Verify your phone and you\'re ready!' },
              { step: '2', title: 'Find Equipment', description: 'Search nearby equipment or list your own. AI helps you find the perfect match.' },
              { step: '3', title: 'Book & Earn', description: 'Rent equipment instantly or start earning by sharing yours. It\'s that easy!' }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white border border-white/20">
                <div className="bg-white text-green-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">{item.title}</h3>
                <p className="text-white/90 text-center leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Start Your Journey Now
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Farming?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of farmers already saving money and earning extra income through equipment sharing
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <Check className="w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <Check className="w-5 h-5" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <Check className="w-5 h-5" />
                  <span>Setup in 30 seconds</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/auth')}
                className="bg-white text-green-600 px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Get Started Free →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-2 rounded-xl">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">FarmShare</span>
          </div>
          <p className="text-slate-400 mb-8">Making agriculture accessible for everyone</p>
          <div className="flex justify-center space-x-8 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <p className="text-slate-500 mt-8">© 2025 FarmShare. Made with ❤️ for Farmers</p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;