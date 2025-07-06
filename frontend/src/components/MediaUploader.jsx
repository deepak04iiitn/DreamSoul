import React, { useState, useRef } from 'react';

export default function MediaUploader({ value, onChange, imageOnly }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (file) => {
    setUploadError('');
    if (!file) return;
    if (imageOnly) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('Profile picture must be less than 2MB');
        return;
      }
    } else {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setUploadError('Only image or video files are allowed');
        return;
      }
      if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
        setUploadError('Photo must be less than 2MB');
        return;
      }
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append(imageOnly ? 'photo' : 'media', file);
      const res = await fetch(imageOnly ? '/backend/profile/upload/profile-picture' : '/backend/profile/upload/hobby', {
        method: 'POST',
        credentials: 'include',
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      if (imageOnly) {
        onChange({ url: data.url, mediaType: 'image' });
      } else {
        onChange({ url: data.url, mediaType: data.type });
      }
      setUploading(false);
    } catch (err) {
      setUploadError(err.message);
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">
        {imageOnly ? 'Profile Picture (max 2MB, JPG/PNG)' : 'Hobby Media (photo max 2MB, video max 10s)'}
      </label>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragOver 
            ? 'border-pink-400 bg-pink-400/10' 
            : 'border-white/30 hover:border-white/50 hover:bg-white/5'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={imageOnly ? 'image/*' : 'image/*,video/*'}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {value?.url ? (
          <div className="space-y-4">
            <img src={value.url} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
            <p className="text-white/60 text-sm">Click to change file</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium mb-2">
                {isDragOver ? 'Drop your file here' : 'Drop files here or click to upload'}
              </p>
              <p className="text-white/60 text-sm">{imageOnly ? 'Supports: JPG, PNG, GIF' : 'Supports: JPG, PNG, GIF, MP4, MOV'}</p>
            </div>
          </div>
        )}
      </div>
      
      {uploading && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 text-pink-400">
            <div className="w-4 h-4 border-2 border-pink-400/20 border-t-pink-400 rounded-full animate-spin"></div>
            <span className="text-sm">Uploading...</span>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="mt-3 text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-2">
          {uploadError}
        </div>
      )}
    </div>
  );
} 