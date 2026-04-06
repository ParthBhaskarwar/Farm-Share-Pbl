import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      info: '1800-FARM-HELP',
      description: 'Mon-Sat, 9AM-6PM',
      color: 'from-green-600 to-emerald-500'
    },
    {
      icon: Mail,
      title: 'Email Us',
      info: 'support@farmshare.com',
      description: 'We\'ll respond within 24 hours',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      info: 'Pune, Maharashtra',
      description: 'Monday to Friday, 9AM-5PM',
      color: 'from-purple-600 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      info: 'Chat with AI Assistant',
      description: 'Available 24/7',
      color: 'from-orange-600 to-red-500'
    }
  ];

  const faqs = [
    {
      question: 'How do I book equipment?',
      answer: 'Search for equipment, select your dates, and click "Book Now". You can also book via SMS or call.'
    },
    {
      question: 'What is dynamic pricing?',
      answer: 'Prices adjust based on demand, season, and your trust score to ensure fair rates for everyone.'
    },
    {
      question: 'How does insurance work?',
      answer: 'Optional insurance (₹250) covers damage up to ₹50,000, theft, and breakdowns.'
    },
    {
      question: 'Can I list my equipment?',
      answer: 'Yes! Go to Dashboard, click "I Have Equipment", and add your equipment details.'
    },
    {
      question: 'What happens if equipment is returned late?',
      answer: 'Late returns may incur additional charges based on hourly or daily rates. Repeated delays can affect your trust score.'
    },
    {
      question: 'How is the trust score calculated?',
      answer: 'Trust score is calculated using timely returns, equipment condition, user ratings, and past booking history.'
    }

  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have questions? We're here to help! Reach out through any channel that works best for you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${method.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{method.title}</h3>
                <p className="text-green-600 font-semibold mb-1">{method.info}</p>
                <p className="text-sm text-slate-600">{method.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/40">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Support</option>
                  <option value="equipment">List Equipment</option>
                  <option value="technical">Technical Issue</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="6"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* FAQ & Info */}
          <div className="space-y-6">
            {/* FAQs */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/40">
              <div className="flex items-center space-x-3 mb-6">
                <HelpCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-slate-800">Quick Answers</h3>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-bold text-slate-800 mb-2">{faq.question}</h4>
                    <p className="text-sm text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Contact Methods */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/40 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Prefer Other Channels?</h3>
          <p className="text-slate-600 mb-6">We're active on social media and ready to help!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Facebook
            </button>
            <button className="bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors">
              Twitter
            </button>
            <button className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors">
              Instagram
            </button>
            <button className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;