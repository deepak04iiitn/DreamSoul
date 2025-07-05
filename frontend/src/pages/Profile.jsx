import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/user/userSlice';
import ProfileCompletion from '../components/ProfileCompletion';
import AddContentModal from '../components/AddContentModal';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('photos');
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalContentType, setModalContentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser && !currentUser.isProfileComplete) {
      setShowProfileCompletion(true);
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/backend/profile/me', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        dispatch(updateUser(data.user));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleAddContent = async (contentData) => {
    await fetchUserProfile();
  };

  const handleDeleteContent = async (contentType, contentId) => {
    try {
      const response = await fetch(`/backend/profile/${contentType}/${contentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchUserProfile();
      }
    } catch (err) {
      console.error('Error deleting content:', err);
    }
  };

  const openAddModal = (contentType) => {
    setModalContentType(contentType);
    setShowAddModal(true);
  };

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

  if (showProfileCompletion) {
    return (
      <ProfileCompletion 
        onComplete={() => {
          setShowProfileCompletion(false);
          fetchUserProfile();
        }} 
      />
    );
  }

  const profileStats = {
    photos: currentUser.allPhotos?.length || 0,
    voices: currentUser.allVoices?.length || 0,
    thoughts: currentUser.allThoughts?.length || 0,
    hobbies: currentUser.allHobbies?.length || 0
  };

  const renderPhotosTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Photos</h3>
        <button
          onClick={() => openAddModal('photo')}
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 cursor-pointer"
        >
          Add Photo
        </button>
      </div>
      
      {currentUser.allPhotos && currentUser.allPhotos.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {currentUser.allPhotos.map((photo) => (
            <div key={photo._id} className="relative cursor-pointer">
              <img 
                src={photo.url} 
                alt={photo.caption || 'Photo'}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteContent('photo', photo._id);
                }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300 bg-white/80 rounded-full p-1 shadow cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/60 mb-4">No photos yet</p>
          <button
            onClick={() => openAddModal('photo')}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 cursor-pointer"
          >
            Add Your First Photo
          </button>
        </div>
      )}
    </div>
  );

  const renderVoicesTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Voices</h3>
        <button
          onClick={() => openAddModal('voice')}
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 cursor-pointer"
        >
          Add Voice
        </button>
      </div>
      
      {currentUser.allVoices && currentUser.allVoices.length > 0 ? (
        <div className="space-y-4">
          {currentUser.allVoices.map((voice) => (
            <div key={voice._id} className="bg-white/5 rounded-lg p-4 flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.787L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.787a1 1 0 011.617.787zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{voice.title}</h3>
                <p className="text-white/60 text-sm">{voice.duration} • {voice.plays} plays</p>
                <audio controls src={voice.url} className="w-full mt-2" />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDeleteContent('voice', voice._id)}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/60 mb-4">No voices yet</p>
          <button
            onClick={() => openAddModal('voice')}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 cursor-pointer"
          >
            Add Your First Voice
          </button>
        </div>
      )}
    </div>
  );

  const renderThoughtsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Thoughts</h3>
        <button
          onClick={() => openAddModal('thought')}
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 cursor-pointer"
        >
          Add Thought
        </button>
      </div>
      
      {currentUser.allThoughts && currentUser.allThoughts.length > 0 ? (
        <div className="space-y-4">
          {currentUser.allThoughts.map((thought) => (
            <div key={thought._id} className="bg-white/5 rounded-lg p-4">
              <p className="text-white mb-3 leading-relaxed">{thought.content}</p>
              <div className="flex items-center justify-between text-sm text-white/60">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 hover:text-pink-400 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{thought.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-pink-400 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>{thought.comments}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">
                    {new Date(thought.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteContent('thought', thought._id)}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/60 mb-4">No thoughts yet</p>
          <button
            onClick={() => openAddModal('thought')}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 cursor-pointer"
          >
            Add Your First Thought
          </button>
        </div>
      )}
    </div>
  );

  const renderHobbiesTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Hobbies</h3>
        <button
          onClick={() => openAddModal('hobby')}
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 cursor-pointer"
        >
          Add Hobby
        </button>
      </div>
      
      {currentUser.allHobbies && currentUser.allHobbies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentUser.allHobbies.map((hobby) => (
            <div key={hobby._id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{hobby.name}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{hobby.description}</p>
                  <p className="text-white/60 text-xs mt-2">
                    Added {new Date(hobby.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteContent('hobby', hobby._id)}
                  className="text-red-400 hover:text-red-300 ml-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/60 mb-4">No hobbies yet</p>
          <button
            onClick={() => openAddModal('hobby')}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 cursor-pointer"
          >
            Add Your First Hobby
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="bg-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {(currentUser.fullName || currentUser.username || 'U').charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 cursor-pointer">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-2xl font-bold text-white">{currentUser.username}</h1>
                <button 
                  onClick={() => setShowProfileCompletion(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
                <button className="text-white/80 hover:text-white cursor-pointer">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="flex space-x-8 mb-4">
                <div className="text-center">
                  <span className="block text-white font-semibold">{profileStats.photos}</span>
                  <span className="text-white/60 text-sm">photos</span>
                </div>
                <div className="text-center">
                  <span className="block text-white font-semibold">{profileStats.voices}</span>
                  <span className="text-white/60 text-sm">voices</span>
                </div>
                <div className="text-center">
                  <span className="block text-white font-semibold">{profileStats.thoughts}</span>
                  <span className="text-white/60 text-sm">thoughts</span>
                </div>
                <div className="text-center">
                  <span className="block text-white font-semibold">{profileStats.hobbies}</span>
                  <span className="text-white/60 text-sm">hobbies</span>
                </div>
              </div>

              {/* Bio */}
              <div className="text-white">
                <p className="font-semibold">{currentUser.fullName || currentUser.username}</p>
                <p className="text-white/80 text-sm mt-1">
                  {currentUser.age && `${currentUser.age} years old • `}
                  {currentUser.city && currentUser.state && `${currentUser.city}, ${currentUser.state}`}
                  {currentUser.country && ` • ${currentUser.country}`}
                </p>
                {currentUser.bio && (
                  <p className="text-white/80 text-sm mt-1">{currentUser.bio}</p>
                )}
                <p className="text-blue-400 text-sm mt-1">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 rounded-2xl">
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 py-4 text-center font-medium transition-colors cursor-pointer ${
                activeTab === 'photos' 
                  ? 'text-pink-400 border-b-2 border-pink-400' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Photos
            </button>
            <button
              onClick={() => setActiveTab('voices')}
              className={`flex-1 py-4 text-center font-medium transition-colors cursor-pointer ${
                activeTab === 'voices' 
                  ? 'text-pink-400 border-b-2 border-pink-400' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.787L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.787a1 1 0 011.617.787zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Voices
            </button>
            <button
              onClick={() => setActiveTab('thoughts')}
              className={`flex-1 py-4 text-center font-medium transition-colors cursor-pointer ${
                activeTab === 'thoughts' 
                  ? 'text-pink-400 border-b-2 border-pink-400' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Thoughts
            </button>
            <button
              onClick={() => setActiveTab('hobbies')}
              className={`flex-1 py-4 text-center font-medium transition-colors cursor-pointer ${
                activeTab === 'hobbies' 
                  ? 'text-pink-400 border-b-2 border-pink-400' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Hobbies
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'photos' && renderPhotosTab()}
            {activeTab === 'voices' && renderVoicesTab()}
            {activeTab === 'thoughts' && renderThoughtsTab()}
            {activeTab === 'hobbies' && renderHobbiesTab()}
          </div>
        </div>
      </div>

      {/* Add Content Modal */}
      <AddContentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        contentType={modalContentType}
        onAdd={handleAddContent}
      />
    </div>
  );
} 