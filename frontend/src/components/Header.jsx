import React, { useState, useEffect } from 'react';
import { Heart, Home, Users, MessageCircle, Bell, DollarSign, Star, Moon } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';

// Floating hearts animation component
const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const createHeart = () => {
      const id = Math.random();
      const newHeart = {
        id,
        left: Math.random() * 100,
        animationDuration: 3 + Math.random() * 2,
        delay: Math.random() * 2
      };
      
      setHearts(prev => [...prev, newHeart]);
      
      setTimeout(() => {
        setHearts(prev => prev.filter(heart => heart.id !== id));
      }, (newHeart.animationDuration + newHeart.delay) * 1000);
    };

    const interval = setInterval(createHeart, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute text-pink-300 opacity-60"
          style={{
            left: `${heart.left}%`,
            animation: `float-up ${heart.animationDuration}s ease-out ${heart.delay}s forwards`
          }}
        >
          <Heart size={12} fill="currentColor" />
        </div>
      ))}
    </div>
  );
};

// Header Component
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.6);
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .gradient-text {
          background: linear-gradient(-45deg, #ff6b9d, #c44569, #f8b500, #ff6b9d);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
        }
        
        .glow-button {
          background: linear-gradient(135deg, #ff6b9d, #c44569);
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
      
      <header
        className="sticky top-0 z-50 relative bg-gradient-to-r from-purple-900 via-pink-900 to-rose-900 overflow-hidden w-full transition-all duration-300 rounded-none"
      >
        <FloatingHearts />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-pink-300">
            <Star size={20} className="animate-pulse" />
          </div>
          <div className="absolute top-20 right-20 text-purple-300">
            <Heart size={16} className="animate-bounce" />
          </div>
          <div className="absolute bottom-10 left-1/4 text-rose-300">
            <Moon size={18} className="animate-pulse" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <img
                src="/DreamSoul.png"
                alt="DreamSoul Logo"
                className="w-18 h-12 rounded-full shadow-2xl"
              />
              <div>
                <h1 className="text-3xl font-bold gradient-text">DreamSoul</h1>
              </div>
            </a>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                <Home size={16} />
                <span>Home</span>
              </a>
              <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                <Users size={16} />
                <span>Match</span>
              </a>
              <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                <MessageCircle size={16} />
                <span>Chats</span>
              </a>
              <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                <Bell size={16} />
                <span>Notifications</span>
              </a>
              <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                <DollarSign size={16} />
                <span>Pricing</span>
              </a>
            </nav>
            
            {/* Sign In Button */}
            <div className="hidden md:flex items-center">
              <Link to="/sign-in">
                <button className="glass-effect text-white px-6 py-2 rounded-full hover:bg-white/20 transition-all">
                  Sign In
                </button>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden glass-effect rounded-lg p-4 mb-4">
              <div className="flex flex-col space-y-4">
                <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                  <Home size={16} />
                  <span>Home</span>
                </a>
                <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                  <Users size={16} />
                  <span>Match</span>
                </a>
                <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                  <MessageCircle size={16} />
                  <span>Chats</span>
                </a>
                <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                  <Bell size={16} />
                  <span>Notifications</span>
                </a>
                <a href="#" className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2">
                  <DollarSign size={16} />
                  <span>Pricing</span>
                </a>
                <div className="pt-4 border-t border-white/20">
                  <button className="glass-effect text-white px-4 py-2 rounded-full w-full">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}