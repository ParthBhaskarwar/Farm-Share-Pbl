import React from 'react';
import { Target, Heart, Users, Zap, Shield, TrendingUp } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Farmer First',
      description: 'Every decision we make puts farmers and their needs at the center',
      color: 'from-red-600 to-pink-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Building a strong network of farmers helping farmers',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Verified users, secure payments, and comprehensive insurance',
      color: 'from-green-600 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging AI and technology to make farming more efficient',
      color: 'from-purple-600 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            About <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">FarmShare</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Empowering farmers through technology and community. Making agricultural equipment accessible and affordable for everyone.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Our Mission</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Revolutionizing Farm Equipment Sharing
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We believe that every farmer should have access to modern agricultural equipment, regardless of their farm size or economic status. By connecting farmers who own equipment with those who need it, we're building a sustainable ecosystem that benefits everyone.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our AI-powered platform makes it easy to find, book, and manage equipment rentals while ensuring trust, safety, and fair pricing for all community members.
            </p>
          </div>
          <div className="relative">
            <img
              src="images/about.jpg"
              alt="Farm equipment"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs">
              <div className="flex items-center space-x-4">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">₹50L+</p>
                  <p className="text-sm text-slate-600">Savings Generated</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600">What drives us every day</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className={`bg-gradient-to-br ${value.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl p-12 mb-16 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-white/90">Making a real difference in farming communities</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">10,000+</p>
              <p className="text-white/90">Active Farmers</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">5,000+</p>
              <p className="text-white/90">Equipment Listed</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">₹50L+</p>
              <p className="text-white/90">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">50+</p>
              <p className="text-white/90">Cities Covered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;