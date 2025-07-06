import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/user/userSlice';
import VoiceRecorderUploader from './VoiceRecorderUploader';
import MediaUploader from './MediaUploader';
import { FaMicrophone, FaImage, FaRegLightbulb, FaUser, FaMapMarkerAlt, FaHeart, FaEdit, FaPlus } from 'react-icons/fa';

export default function ProfileCompletion({ onComplete, currentUser, isEdit }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    profilePicture: '',
    age: '',
    city: '',
    state: '',
    country: '',
    interestedIn: '',
    bio: '',
    introVoice: '',
    introVoiceDuration: '',
    introHobbyUrl: '',
    introHobbyType: '',
    introThought: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editVoice, setEditVoice] = useState(false);
  const [editHobby, setEditHobby] = useState(false);
  const [editThought, setEditThought] = useState(false);

  useEffect(() => {
    if (isEdit && currentUser) {
      setFormData({
        profilePicture: currentUser.profilePicture || '',
        age: currentUser.age || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        country: currentUser.country || '',
        interestedIn: currentUser.interestedIn || '',
        bio: currentUser.bio || '',
        introVoice: currentUser.introVoice || '',
        introVoiceDuration: currentUser.introVoiceDuration || '',
        introHobbyUrl: currentUser.introHobbyUrl || '',
        introHobbyType: currentUser.introHobbyType || '',
        introThought: currentUser.introThought || ''
      });
      setEditVoice(false);
      setEditHobby(false);
      setEditThought(false);
    }
  }, [isEdit, currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/backend/profile/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete profile');
      }

      dispatch(updateUser(data.user));
      onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUser className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {isEdit ? 'Edit Your Profile' : 'Complete Your Profile'}
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            {isEdit ? 'Update your details and showcase your personality' : 'Let your personality shine through and start connecting with amazing people'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Profile Picture Upload */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Profile Picture</h2>
            <div className="flex flex-col items-center">
              <div className="relative group mb-4">
                <img
                  src={formData.profilePicture || 'https://www.pngall.com/wp-content/uploads/5/Profile.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-r from-purple-400 to-pink-400 shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <MediaUploader
                value={{ url: formData.profilePicture, mediaType: 'image' }}
                onChange={({ url }) => setFormData(prev => ({ ...prev, profilePicture: url }))}
                imageOnly={true}
              />
            </div>
          </div>

          {/* Introduction Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Show Your Personality
            </h2>
            <p className="text-white/60 text-center mb-12">Add personal touches to make your profile stand out</p>
            
            <div className="space-y-8">
              {/* Voice Introduction */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FaMicrophone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Voice Introduction</h3>
                    <p className="text-white/60">Let them hear your voice</p>
                  </div>
                </div>
                
                {formData.introVoice && !editVoice ? (
                  <div className="flex items-center gap-4">
                    <audio controls src={formData.introVoice} className="flex-1 h-12 rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setEditVoice(true)}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <FaEdit className="text-sm" />
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <VoiceRecorderUploader
                      value={{ url: formData.introVoice, duration: formData.introVoiceDuration }}
                      onChange={({ url, duration }) => setFormData(prev => ({ ...prev, introVoice: url, introVoiceDuration: duration }))}
                    />
                    {formData.introVoice && (
                      <button
                        type="button"
                        onClick={() => setEditVoice(false)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Hobby Introduction */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <FaImage className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Hobby Introduction</h3>
                    <p className="text-white/60">Share what you love doing</p>
                  </div>
                </div>
                
                {formData.introHobbyUrl && !editHobby ? (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      {formData.introHobbyType === 'video' ? (
                        <video src={formData.introHobbyUrl} controls className="w-full h-48 object-cover rounded-xl border border-white/20" />
                      ) : (
                        <img src={formData.introHobbyUrl} alt="Intro Hobby" className="w-full h-48 object-cover rounded-xl border border-white/20" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditHobby(true)}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <FaEdit className="text-sm" />
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <MediaUploader
                      value={{ url: formData.introHobbyUrl, mediaType: formData.introHobbyType }}
                      onChange={({ url, mediaType }) => setFormData(prev => ({ ...prev, introHobbyUrl: url, introHobbyType: mediaType }))}
                    />
                    {formData.introHobbyUrl && (
                      <button
                        type="button"
                        onClick={() => setEditHobby(false)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Thoughts Introduction */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <FaRegLightbulb className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Thoughts Introduction</h3>
                    <p className="text-white/60">Share an inspiring thought</p>
                  </div>
                </div>
                
                {formData.introThought && !editThought ? (
                  <div className="flex items-start gap-4">
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-white break-words">{formData.introThought}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditThought(true)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <FaEdit className="text-sm" />
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      name="introThought"
                      value={formData.introThought}
                      onChange={handleChange}
                      rows="3"
                      maxLength="200"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 resize-none"
                      placeholder="Share an inspiring thought..."
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">{formData.introThought.length}/200</span>
                      {formData.introThought && (
                        <button
                          type="button"
                          onClick={() => setEditThought(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Personal Details
            </h2>
            <p className="text-white/60 text-center mb-12">Tell us about yourself</p>

            <div className="space-y-8">
              {/* Age and Interest */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-medium text-lg">
                    <FaUser className="text-purple-400" />
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    required
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 text-lg"
                    placeholder="Enter your age"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-medium text-lg">
                    <FaHeart className="text-pink-400" />
                    Interested In
                  </label>
                  <select
                    name="interestedIn"
                    value={formData.interestedIn}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-200 text-lg"
                  >
                    <option className="bg-red-300 text-white" value="">Select preference</option>
                    <option className="bg-red-300 text-white" value="male">Male</option>
                    <option className="bg-red-300 text-white" value="female">Female</option>
                    <option className="bg-red-300 text-white" value="both">Both</option>
                    <option className="bg-red-300 text-white" value="others">Others</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white font-medium text-lg">
                  <FaMapMarkerAlt className="text-blue-400" />
                  Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 text-lg"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 text-lg"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 text-lg"
                    placeholder="Country"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white font-medium text-lg">
                  <FaRegLightbulb className="text-yellow-400" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 resize-none text-lg"
                  placeholder="Tell us about yourself, your interests, what makes you unique..."
                />
                <div className="flex justify-between items-center">
                  <p className="text-white/60 text-sm">Share your story and what makes you special</p>
                  <p className="text-white/60 text-sm">{formData.bio.length}/500</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white py-5 px-12 rounded-2xl font-bold text-xl hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/25 min-w-[200px] cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {isEdit ? 'Updating...' : 'Completing...'}
                </div>
              ) : (
                isEdit ? 'Update Profile' : 'Complete Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}