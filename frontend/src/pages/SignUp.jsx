import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.username || !formData.email || !formData.password || !formData.gender) {
      return setErrorMessage('Please fill out all details!');
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/backend/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Primary orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-64 h-64 bg-indigo-500/8 rounded-full blur-2xl animate-ping animation-delay-2000"></div>
        
        {/* Secondary accent orbs */}
        <div className="absolute top-16 right-16 w-32 h-32 bg-cyan-400/8 rounded-full blur-xl animate-bounce animation-delay-500"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-violet-500/6 rounded-full blur-2xl animate-pulse animation-delay-1500"></div>
      </div>

      {/* Floating Elements Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/5 text-white/8 text-5xl animate-float">🌙</div>
        <div className="absolute top-32 right-1/5 text-white/8 text-4xl animate-float-delayed">⭐</div>
        <div className="absolute bottom-40 left-1/3 text-white/8 text-3xl animate-float">💭</div>
        <div className="absolute bottom-60 right-1/3 text-white/8 text-4xl animate-float-delayed">🎨</div>
        <div className="absolute top-1/2 left-10 text-white/6 text-2xl animate-float">✨</div>
        <div className="absolute top-1/3 right-10 text-white/6 text-3xl animate-float-delayed">🌟</div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/5">
            <div className="grid lg:grid-cols-2 min-h-[700px]">
              
              {/* Left Panel - Brand Experience */}
              <div className="relative flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10"></div>
                
                <div className="relative z-10 text-center lg:text-left">
                  {/* Logo Section */}
                  <div className="flex justify-center mb-8">
                    <Link to="/" className="group">
                      <div className="relative flex justify-center items-center">
                        <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                        <img
                          src="/DreamSoul.png"
                          alt="DreamSoul"
                          className="relative h-32 w-32 object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Brand Header */}
                  <div className="mb-16 space-y-6">
                    <h1 className="text-5xl lg:text-6xl font-light tracking-tight">
                      <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        Dream
                      </span>
                      <span className="bg-gradient-to-r from-pink-200 via-purple-200 to-white bg-clip-text text-transparent font-medium">
                        Soul
                      </span>
                    </h1>
                    <div className="relative">
                      <p className="text-xl lg:text-2xl text-white/70 font-light italic leading-relaxed max-w-md mx-auto lg:mx-0">
                        "First, hear their soul. Then see their art. Finally, dream together."
                      </p>
                      <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full opacity-30"></div>
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                    {[
                      {
                        icon: (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        ),
                        title: "Voice-First Connections",
                        description: "Hear their soul before seeing their face",
                        gradient: "from-purple-500 to-indigo-500"
                      },
                      {
                        icon: (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        ),
                        title: "Creative Tasks",
                        description: "Share your art, discover their creativity",
                        gradient: "from-indigo-500 to-cyan-500"
                      },
                      {
                        icon: (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        ),
                        title: "Thought Matching",
                        description: "Connect through subconscious alignment",
                        gradient: "from-pink-500 to-rose-500"
                      }
                    ].map((feature, index) => (
                      <div key={index} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl blur-sm group-hover:from-white/8 transition-all duration-300"></div>
                        <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/[0.06] transition-all duration-300">
                          <div className="flex items-center space-x-4">
                            <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {feature.icon}
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-white/90 text-lg">{feature.title}</h3>
                              <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Sign Up Form */}
              <div className="relative flex items-center justify-center p-8 lg:p-12 xl:p-16">
                {/* Form background overlay */}
                <div className="absolute inset-0 bg-gradient-to-tl from-white/[0.02] via-transparent to-white/[0.01]"></div>
                
                <div className="relative z-10 w-full max-w-sm">
                  {/* Form Header */}
                  <div className="text-center mb-10">
                    <h2 className="text-3xl lg:text-4xl font-light text-white mb-3 tracking-tight">
                      Begin Your Journey
                    </h2>
                    <p className="text-white/60 text-lg font-light">
                      Create your account to discover authentic connections
                    </p>
                  </div>

                  {/* Sign Up Form */}
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                      {/* Full Name Field */}
                      <div className="group">
                        <label className="block text-sm font-medium text-white/70 mb-3 tracking-wide">
                          FULL NAME
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="fullName"
                            onChange={handleChange}
                            className="w-full max-w-md mx-auto px-5 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 outline-none hover:bg-white/[0.06] text-lg"
                            placeholder="your full name"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>

                      {/* Username Field */}
                      <div className="group">
                        <label className="block text-sm font-medium text-white/70 mb-3 tracking-wide">
                          USERNAME
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="username"
                            onChange={handleChange}
                            className="w-full max-w-md mx-auto px-5 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 outline-none hover:bg-white/[0.06] text-lg"
                            placeholder="your unique username"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="group">
                        <label className="block text-sm font-medium text-white/70 mb-3 tracking-wide">
                          EMAIL ADDRESS
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            onChange={handleChange}
                            className="w-full max-w-md mx-auto px-5 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 outline-none hover:bg-white/[0.06] text-lg"
                            placeholder="your@email.com"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="group">
                        <label className="block text-sm font-medium text-white/70 mb-3 tracking-wide">
                          PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            id="password"
                            onChange={handleChange}
                            className="w-full max-w-md mx-auto px-5 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 outline-none hover:bg-white/[0.06] text-lg"
                            placeholder="••••••••••••"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>

                      {/* Gender Field */}
                      <div className="group">
                        <label className="block text-sm font-medium text-white/70 mb-3 tracking-wide">
                          GENDER
                        </label>
                        <div className="relative">
                          <select
                            id="gender"
                            onChange={handleChange}
                            className="w-full max-w-md mx-auto px-5 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 outline-none hover:bg-white/[0.06] text-lg appearance-none cursor-pointer"
                            defaultValue=""
                          >
                            <option value="" disabled className="bg-slate-800 text-white">Select your gender</option>
                            <option value="male" className="bg-slate-800 text-white">Male</option>
                            <option value="female" className="bg-slate-800 text-white">Female</option>
                            <option value="other" className="bg-slate-800 text-white">Other</option>
                          </select>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full cursor-pointer relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-medium hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center group mt-8 text-lg tracking-wide"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center">
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Your DreamSoul</span>
                            <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </div>
                    </button>

                    {/* Error Message */}
                    {errorMessage && (
                      <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/20 text-red-300 p-4 rounded-2xl text-sm animate-fade-in mt-6">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errorMessage}
                        </div>
                      </div>
                    )}

                    {/* Sign In Link */}
                    <div className="text-center pt-6">
                      <p className="text-white/60 text-lg">
                        Already have an account?{' '}
                        <Link 
                          to="/sign-in" 
                          className="font-medium text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 transition-all duration-300"
                        >
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-2deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}