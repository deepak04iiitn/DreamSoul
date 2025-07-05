import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/user/userSlice';

export default function ProfileCompletion({ onComplete }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    age: '',
    city: '',
    state: '',
    country: '',
    interestedIn: '',
    bio: '',
    introVoice: '',
    introHobby: '',
    introThought: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-pink-400 mb-2">Complete Your Profile</h2>
          <p className="text-white/80">Fill in your details to start matching with others</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Interested In *
              </label>
              <select
                name="interestedIn"
                value={formData.interestedIn}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-pink-400 transition-colors"
              >
                <option value="">Select preference</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Enter your city"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Enter your state"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Enter your country"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows="4"
              maxLength="500"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="text-white/60 text-sm mt-1">{formData.bio.length}/500</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Intro Voice (URL)
              </label>
              <input
                type="url"
                name="introVoice"
                value={formData.introVoice}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Voice recording URL"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Intro Hobby
              </label>
              <input
                type="text"
                name="introHobby"
                value={formData.introHobby}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Your favorite hobby"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Intro Thought
              </label>
              <input
                type="text"
                name="introThought"
                value={formData.introThought}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="A thought to share"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-500 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Completing Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
} 