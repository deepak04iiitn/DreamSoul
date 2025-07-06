import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Volume2, 
  Palette, 
  Brain, 
  Star, 
  ArrowRight, 
  Play, 
  Users, 
  Sparkles,
  MessageCircle,
  Camera,
  Headphones,
  PenTool,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DreamSoulLanding() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "His voice told me everything before I even saw his face. We connected on a level I never knew existed.",
      name: "Priya S.",
      age: "26",
      location: "Mumbai"
    },
    {
      text: "Through our shared creative challenges, I found someone who truly gets my artistic soul.",
      name: "Arjun K.",
      age: "29",
      location: "Bangalore"
    },
    {
      text: "Our thoughts journaling revealed how similarly we dream. Now we're building those dreams together.",
      name: "Sneha & Rahul",
      age: "24 & 27",
      location: "Delhi"
    }
  ];

  const threePillars = [
    {
      icon: Volume2,
      title: "Voice-First Connection",
      subtitle: "Hear Their Soul",
      description: "Connect through authentic voice intros that reveal true personality, emotions, and depth before seeing photos.",
      features: ["Voice introductions", "Audio prompts", "Anonymous voice options", "Gradual photo reveal"],
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Palette,
      title: "Creative Expression",
      subtitle: "See Their Art",
      description: "Weekly creative challenges that showcase hobbies, talents, and passions through images, videos, and audio.",
      features: ["Weekly art challenges", "Hobby showcasing", "Creative portfolios", "Artistic conversations"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Brain,
      title: "Thoughts Journaling",
      subtitle: "Share Your Mind",
      description: "Express your deepest thoughts, aspirations, and inner world through thoughtful text and audio entries.",
      features: ["Personal reflections", "Thought sharing", "Deep conversations", "Mental compatibility"],
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const profiles = [
    { id: 1, name: "Aarav", age: 28, hobby: "Photography", thought: "Chasing sunsets and meaningful conversations..." },
    { id: 2, name: "Diya", age: 25, hobby: "Poetry", thought: "Words have power to heal and connect souls..." },
    { id: 3, name: "Karan", age: 30, hobby: "Music", thought: "Every melody tells a story waiting to be shared..." },
    { id: 4, name: "Anaya", age: 27, hobby: "Painting", thought: "Colors express what words cannot..." },
    { id: 5, name: "Rohan", age: 26, hobby: "Writing", thought: "Stories connect us across time and space..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % threePillars.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      fetch(`/backend/profile/search?q=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => setSuggestions(data.users || []));
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const handleSelect = (username) => {
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/profile/${username}`);
  };

  // Fix for dynamic icon rendering
  const ActiveIcon = threePillars[activeFeature].icon;

  return (
    <>
      <style jsx>{`
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
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        {/* Logo at Top */}
        <div className="w-full flex justify-center pt-12 pb-8 z-20 relative">
          <img
            src="/DreamSoul.png"
            alt="DreamSoul Logo"
            className="w-60 h-40 rounded-full shadow-2xl"
          />
        </div>
        {/* Profile Search Bar */}
        <div className="flex justify-center mb-6 z-30 relative">
          <div className="w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search profiles by username..."
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-200 shadow-lg"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white/90 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                {suggestions.map(user => (
                  <div
                    key={user.username}
                    onMouseDown={() => handleSelect(user.username)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-pink-100/80 transition-colors"
                  >
                    <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full object-cover border border-pink-300" />
                    <div>
                      <div className="font-semibold text-pink-600">{user.username}</div>
                      <div className="text-xs text-gray-600">{user.fullName}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
          
          {/* Floating Hearts */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <Heart className="w-4 h-4 text-pink-400/40" />
            </motion.div>
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-8 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  First, hear their soul.
                </span>
                <br />
                <span className="text-white/90">Then see their art.</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Finally, dream together.
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Revolutionary dating that prioritizes emotional, creative, and intellectual connections over superficial interactions.
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.button 
                className="group bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                className="group flex items-center space-x-3 text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play className="w-6 h-6 ml-1" />
                </div>
                <span className="text-lg">See How It Works</span>
              </motion.button>
            </motion.div>

            {/* Weekly Random Match Gamification */}
            <motion.div 
              className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-8 max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
                </motion.div>
                <h3 className="text-2xl font-bold">Weekly Random Match is LIVE!</h3>
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400 ml-3" />
                </motion.div>
              </div>
              <p className="text-lg text-white/90 mb-6">
                "Try your Luck, Just 1 click away to meet your soulmate."
              </p>
              <motion.button 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register Now
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Three Pillars Section */}
        <section id="features" className="relative z-10 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Three Pillars of Connection
                </span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Our revolutionary approach creates meaningful relationships through voice, creativity, and thoughts
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {threePillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500 overflow-hidden group cursor-pointer`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setActiveFeature(index)}
                >
                  {/* Background Gradient Effect */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-r ${pillar.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    initial={false}
                    animate={{ opacity: activeFeature === index ? 0.1 : 0 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-20 h-20 bg-gradient-to-r ${pillar.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <pillar.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-2 text-center">{pillar.title}</h3>
                    <p className="text-lg text-pink-300 mb-4 text-center font-medium">{pillar.subtitle}</p>
                    <p className="text-white/80 text-center leading-relaxed mb-6">{pillar.description}</p>
                    
                    <div className="space-y-2">
                      {pillar.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center space-x-2 text-sm text-white/70"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${pillar.color}`} />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Interactive Section */}
        <section id="how-it-works" className="relative z-10 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  How DreamSoul Works
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-8">
                  {threePillars.map((step, index) => (
                    <motion.div 
                      key={index}
                      className={`flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                        activeFeature === index ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'
                      }`}
                      onClick={() => setActiveFeature(index)}
                      whileHover={{ x: 10 }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-white/70">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className={`w-24 h-24 bg-gradient-to-r ${threePillars[activeFeature].color} rounded-full flex items-center justify-center mx-auto mb-6`}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1 }}
                    >
                      <ActiveIcon className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">{threePillars[activeFeature].subtitle}</h3>
                    <p className="text-white/80 mb-6">{threePillars[activeFeature].description}</p>
                    <motion.button 
                      className={`bg-gradient-to-r ${threePillars[activeFeature].color} px-6 py-3 rounded-full font-semibold`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try This Feature
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Random Profiles Preview */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Meet Amazing Souls
                </span>
              </h2>
              <p className="text-white/80 text-lg">Discover authentic connections waiting to be made</p>
            </motion.div>

            <div className="flex overflow-x-auto space-x-6 pb-4 hide-scrollbar">
              {profiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  className="flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-80 hover:bg-white/15 transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-1">{profile.name}, {profile.age}</h3>
                  <p className="text-pink-300 text-center mb-3 font-medium">{profile.hobby}</p>
                  <p className="text-white/70 text-center mb-4 italic">"{profile.thought}"</p>
                  <div className="flex justify-center space-x-2">
                    <motion.button 
                      className="p-2 bg-pink-500/20 rounded-full hover:bg-pink-500/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Headphones className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      className="p-2 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PenTool className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      className="p-2 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Lightbulb className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="relative z-10 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-4xl font-bold mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Love Stories Born Here
              </span>
            </motion.h2>
            
            <div className="relative h-64 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full flex flex-col justify-center">
                    <p className="text-xl text-white/90 mb-6 italic">"{testimonials[currentTestimonial].text}"</p>
                    <div className="flex items-center justify-center">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Heart className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                        <p className="text-white/60">{testimonials[currentTestimonial].age} • {testimonials[currentTestimonial].location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-pink-400 w-8'
                      : 'bg-white/30 hover:bg-white/50 w-3'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Ready to Find Your Soul?
                </span>
              </motion.h2>
              <motion.p 
                className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Join thousands who've discovered authentic love through voice, creativity, and thoughts.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.button 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join DreamSoul Now
                </motion.button>
                <motion.button 
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-400/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
