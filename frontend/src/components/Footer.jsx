import React from 'react'
import { Heart, Mic, Palette, Moon, Star, Users, MessageCircle, Shield, Download, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
    return (
      <footer className="relative bg-gradient-to-t from-purple-950 via-pink-950 to-rose-950 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10">
            <Heart size={40} className="text-pink-300 animate-pulse" />
          </div>
          <div className="absolute top-20 right-20">
            <Star size={35} className="text-purple-300 animate-bounce" />
          </div>
          <div className="absolute bottom-10 left-1/3">
            <Moon size={30} className="text-rose-300 animate-pulse" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart size={20} className="text-white" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold gradient-text">DreamSoul</h3>
              </div>
              <p className="text-pink-200 mb-6 leading-relaxed">
                Where authentic connections bloom through voice, creativity, and dreams. 
                Join thousands finding their soulmates beyond the surface.
              </p>
              <div className="flex items-center space-x-4">
                <button className="glow-button text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center space-x-2">
                  <Download size={16} />
                  <span>Download App</span>
                </button>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Heart size={16} className="text-pink-400" />
                <span>Features</span>
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-pink-200 hover:text-white transition-colors flex items-center space-x-2">
                  <Mic size={14} />
                  <span>Voice Matching</span>
                </a></li>
                <li><a href="#" className="text-pink-200 hover:text-white transition-colors flex items-center space-x-2">
                  <Palette size={14} />
                  <span>Creative Challenges</span>
                </a></li>
                <li><a href="#" className="text-pink-200 hover:text-white transition-colors flex items-center space-x-2">
                  <Moon size={14} />
                  <span>Dream Journaling</span>
                </a></li>
                <li><a href="#" className="text-pink-200 hover:text-white transition-colors flex items-center space-x-2">
                  <Shield size={14} />
                  <span>Safe & Secure</span>
                </a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <MessageCircle size={16} className="text-pink-400" />
                <span>Support</span>
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Safety Tips</a></li>
                <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="mailto:support@dreamsoul.app" className="text-pink-200 hover:text-white transition-colors flex items-center space-x-2">
                  <Mail size={14} />
                  <span>Contact Us</span>
                </a></li>
              </ul>
            </div>
          </div>
          
          {/* Premium Plan Highlight */}
          <div className="glass-effect rounded-2xl p-6 mb-8 text-center">
            <h4 className="text-2xl font-bold gradient-text mb-2">Premium Experience</h4>
            <p className="text-pink-200 mb-4">Unlock unlimited connections and exclusive features</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-pink-200">
              <span>✨ Unlimited Matches</span>
              <span>💬 Direct Messaging</span>
              <span>🎨 Creative Spotlights</span>
              <span>🌙 Dream Visualizations</span>
            </div>
            <p className="text-3xl font-bold text-white mt-4">₹299/month <span className="text-lg text-pink-300">($3.60)</span></p>
          </div>
          
          {/* Social Links & Bottom */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-pink-300 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-pink-300 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-pink-300 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-pink-200 text-sm">© 2025 DreamSoul Inc. Made with ❤️ for authentic connections</p>
              <p className="text-pink-300 text-xs mt-1">Visit us at dreamsoul.app</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  