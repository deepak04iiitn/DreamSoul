import React from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-white/10 p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-pink-400">You are not signed in</h2>
          <p className="text-white/80">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4 text-pink-400">Welcome, {currentUser.fullName || currentUser.username || 'User'}!</h2>
        <p className="text-white/80 mb-2">Email: {currentUser.email}</p>
        <p className="text-white/80 mb-2">Username: {currentUser.username}</p>
        <p className="text-white/80 mb-2">Gender: {currentUser.gender ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1) : 'Not specified'}</p>
        <p className="text-white/80 mb-2">Status: {currentUser.status}</p>
        {/* Add more profile details here as needed */}
      </div>
    </div>
  );
} 