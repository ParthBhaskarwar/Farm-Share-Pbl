import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import api from './../api/axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'नमस्ते! I\'m FarmShare AI Assistant. I can help you with:\n\n• Finding equipment near you\n• Understanding dynamic pricing\n• Planning crop schedules\n• Booking equipment\n• Trust score questions\n\nHow can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    'Show me tractors near me',
    'How does dynamic pricing work?',
    'What equipment do I need for wheat?',
    'Explain trust score system',
    'How to book equipment offline?',
    'Insurance options available?'
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/farmer/chat', {
        message: input
      });

      const botMessage = { 
        role: 'bot', 
        text: response.data.reply 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = { 
        role: 'bot', 
        text: 'Sorry, I encountered an error. Please try again later.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full mb-4">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">AI Assistant</h1>
          <p className="text-slate-600">Get instant help in multiple languages</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500'
                      : 'bg-gradient-to-br from-green-600 to-emerald-500'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      : 'bg-white/80 text-slate-800'
                  }`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-green-600 to-emerald-500">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/80 rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-slate-700">Quick Questions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(question);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs bg-white border border-green-200 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-200">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Type your question in English, Hindi, or Marathi..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-white/40">
            <h3 className="font-semibold text-slate-800 mb-2">🌐 Multilingual</h3>
            <p className="text-sm text-slate-600">Ask in English, Hindi, Marathi, and more</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-white/40">
            <h3 className="font-semibold text-slate-800 mb-2">⚡ Instant Answers</h3>
            <p className="text-sm text-slate-600">Get immediate responses 24/7</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-white/40">
            <h3 className="font-semibold text-slate-800 mb-2">🎯 Smart Recommendations</h3>
            <p className="text-sm text-slate-600">AI-powered equipment suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;