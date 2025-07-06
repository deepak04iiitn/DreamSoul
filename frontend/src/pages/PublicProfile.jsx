import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/backend/profile/public/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProfile(data.user);
        else setError(data.message || 'User not found');
      })
      .catch(() => setError('Failed to load profile'));
  }, [username]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-red-400 text-center text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl mb-8 hover:bg-white/10 transition-all duration-500">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
              <div className="relative group">
                <img
                  src={profile.profilePicture}
                  alt={profile.username}
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-gradient-to-r from-purple-400 to-pink-400 shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
                  {profile.username}
                </h1>
                {profile.fullName && (
                  <div className="text-white/80 text-lg lg:text-xl font-medium mb-3">
                    {profile.fullName}
                  </div>
                )}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-white/60 text-sm">
                  {profile.age && (
                    <span className="bg-white/10 px-3 py-1 rounded-full">{profile.age} years old</span>
                  )}
                  {profile.city && (
                    <span className="bg-white/10 px-3 py-1 rounded-full">{profile.city}</span>
                  )}
                  {profile.state && (
                    <span className="bg-white/10 px-3 py-1 rounded-full">{profile.state}</span>
                  )}
                  {profile.country && (
                    <span className="bg-white/10 px-3 py-1 rounded-full">{profile.country}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl mb-8 hover:bg-white/10 transition-all duration-500">
              <h2 className="text-xl lg:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                About Me
              </h2>
              <p className="text-white/80 text-base lg:text-lg leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Voices Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500">
              <h3 className="text-xl lg:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                Voice Notes
              </h3>
              {profile.allVoices && profile.allVoices.length > 0 ? (
                <div className="space-y-4">
                  {profile.allVoices.map(voice => (
                    <div key={voice._id} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                      <div className="font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                        {voice.title}
                      </div>
                      <audio 
                        controls 
                        src={voice.url} 
                        className="w-full h-10 rounded-lg [&::-webkit-media-controls-panel]:bg-white/10 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white" 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/50 text-center py-8 text-sm">
                  No voice notes shared yet
                </div>
              )}
            </div>

            {/* Hobbies Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500">
              <h3 className="text-xl lg:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                Hobbies & Interests
              </h3>
              {profile.allHobbies && profile.allHobbies.length > 0 ? (
                <div className="space-y-4">
                  {profile.allHobbies.map(hobby => (
                    <div key={hobby._id} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                      <div className="font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {hobby.name}
                      </div>
                      <div className="text-white/70 text-sm mb-3 leading-relaxed">
                        {hobby.description}
                      </div>
                      {hobby.url && (
                        <div className="rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
                          {hobby.mediaType === 'video' ? (
                            <video 
                              src={hobby.url} 
                              controls 
                              className="w-full h-32 object-cover"
                              poster=""
                            />
                          ) : (
                            <img 
                              src={hobby.url} 
                              alt={hobby.name} 
                              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/50 text-center py-8 text-sm">
                  No hobbies shared yet
                </div>
              )}
            </div>
          </div>

          {/* Thoughts Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl mt-8 hover:bg-white/10 transition-all duration-500">
            <h3 className="text-xl lg:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
              Thoughts & Reflections
            </h3>
            {profile.allThoughts && profile.allThoughts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profile.allThoughts.map(thought => (
                  <div key={thought._id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-3 text-lg group-hover:from-pink-300 group-hover:to-purple-300 transition-all">
                      {thought.title}
                    </div>
                    <div className="text-white/80 whitespace-pre-line leading-relaxed">
                      {thought.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/50 text-center py-8 text-sm">
                No thoughts shared yet
              </div>
            )}
          </div>

          {/* Photos Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl mt-8 hover:bg-white/10 transition-all duration-500">
            <h3 className="text-xl lg:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
              Photo Gallery
            </h3>
            {profile.allPhotos && profile.allPhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {profile.allPhotos.map(photo => (
                  <div key={photo._id} className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Photo'}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/50 text-center py-8 text-sm">
                No photos shared yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}