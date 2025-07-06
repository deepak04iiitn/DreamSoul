import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/user/userSlice';
import ProfileCompletion from '../components/ProfileCompletion';
import AddContentModal from '../components/AddContentModal';
import DeleteAccountModal from '../components/DeleteAccountModal';
import MediaUploader from '../components/MediaUploader';
import Cropper from 'react-easy-crop';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('photos');
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalContentType, setModalContentType] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePic, setProfilePic] = useState(currentUser?.profilePicture || '');
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const [profilePicError, setProfilePicError] = useState('');
  const fileInputRef = useRef(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (currentUser && !currentUser.isProfileComplete) {
      setShowProfileCompletion(true);
    }
    setProfilePic(currentUser?.profilePicture || '');
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

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Helper to get cropped image blob
  async function getCroppedImg(imageSrc, cropPixels) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  }

  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (error) => reject(error));
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicError('');
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    setProfilePicUploading(true);
    setShowCropModal(false);
    setUploadProgress(0);
    try {
      const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);
      const form = new FormData();
      form.append('photo', croppedBlob, 'profile.jpg');

      // Use XMLHttpRequest for progress
      await new Promise((resolve, reject) => {
        const xhr = new window.XMLHttpRequest();
        xhr.open('POST', '/backend/profile/upload/profile-picture');
        xhr.withCredentials = true;
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            setProfilePic(data.url);
            dispatch(updateUser({ ...currentUser, profilePicture: data.url }));
            resolve();
          } else {
            const data = JSON.parse(xhr.responseText);
            setProfilePicError(data.message || 'Upload failed');
            reject(new Error(data.message || 'Upload failed'));
          }
        };
        xhr.onerror = () => {
          setProfilePicError('Upload failed');
          reject(new Error('Upload failed'));
        };
        xhr.send(form);
      });
    } catch (err) {
      setProfilePicError(err.message);
    } finally {
      setProfilePicUploading(false);
      setSelectedImage(null);
      setUploadProgress(0);
    }
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
        currentUser={currentUser}
        isEdit={showProfileCompletion}
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
        <div className="flex items-center space-x-4">
          <span className="text-white/60 text-sm">{profileStats.voices}/5 voices</span>
          <button
            onClick={() => openAddModal('voice')}
            disabled={profileStats.voices >= 5}
            className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
              profileStats.voices >= 5
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600'
            }`}
          >
            Add Voice
          </button>
        </div>
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
              <h4 className="text-lg font-bold text-pink-400 mb-1">{thought.title}</h4>
              <p className="text-white mb-3 leading-relaxed break-all max-h-32 overflow-hidden text-ellipsis whitespace-pre-line">{thought.content}</p>
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

  const renderHobbiesTab = () => {
    const videoHobbies = currentUser.allHobbies?.filter(hobby => hobby.mediaType === 'video') || [];
    const videoCount = videoHobbies.length;
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Hobbies</h3>
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm">{videoCount}/5 videos</span>
            <button
              onClick={() => openAddModal('hobby')}
              disabled={videoCount >= 5}
              className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                videoCount >= 5
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600'
              }`}
            >
              Add Hobby
            </button>
          </div>
        </div>
      
      {currentUser.allHobbies && currentUser.allHobbies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentUser.allHobbies.map((hobby) => (
            <div key={hobby._id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{hobby.name}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{hobby.description}</p>
                  
                  {/* Display media if available */}
                  {hobby.url && (
                    <div className="mt-3">
                      {hobby.mediaType === 'video' ? (
                        <video 
                          src={hobby.url} 
                          controls 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <img 
                          src={hobby.url} 
                          alt={hobby.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  )}
                  
                  <p className="text-white/60 text-xs mt-2">
                    Added {new Date(hobby.createdAt).toLocaleDateString()}
                    {hobby.mediaType && ` • ${hobby.mediaType}`}
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <div className="bg-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-6">
              {/* Profile Avatar */}
              <div className="relative group cursor-pointer" onClick={handleAvatarClick} tabIndex={0} role="button">
                <img
                  src={profilePic || 'https://www.pngall.com/wp-content/uploads/5/Profile.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-r from-purple-400 to-pink-400 shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 cursor-pointer border-2 border-white shadow"
                  onClick={handleAvatarClick}
                  tabIndex={-1}
                  aria-label="Change profile picture"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                {profilePicUploading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <svg className="w-28 h-28" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 44}
                        strokeDashoffset={2 * Math.PI * 44 * (1 - uploadProgress / 100)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.3s' }}
                      />
                      <text
                        x="50"
                        y="54"
                        textAnchor="middle"
                        fontSize="22"
                        fill="#ec4899"
                        fontWeight="bold"
                      >
                        {uploadProgress}%
                      </text>
                    </svg>
                  </div>
                )}
                {profilePicError && (
                  <div className="mt-2 text-red-400 text-sm absolute left-1/2 -translate-x-1/2 top-full whitespace-nowrap">{profilePicError}</div>
                )}
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
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Delete Account
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

        {/* Delete Account Modal */}
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        />

        {/* Cropping Modal */}
        {showCropModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
              <h2 className="text-lg font-bold mb-4 text-center">Crop and Adjust Profile Picture</h2>
              <div className="relative w-full h-64 bg-gray-200">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => { setShowCropModal(false); setSelectedImage(null); }}
                    className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                  >Cancel</button>
                  <button
                    onClick={handleCropSave}
                    className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600"
                  >Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 