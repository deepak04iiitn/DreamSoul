import React, { useState, useRef, useEffect } from 'react';

export default function VoiceRecorderUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedUrl, setRecordedUrl] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const recordingInterval = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [noAudioWarning, setNoAudioWarning] = useState(false);

  // Draw waveform for playback
  useEffect(() => {
    if (isPlaying && audioBuffer) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ec4899';
      ctx.beginPath();
      const data = audioBuffer.getChannelData(0);
      const step = Math.ceil(data.length / canvas.width);
      for (let i = 0; i < canvas.width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
          const datum = data[i * step + j];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }
        ctx.moveTo(i, (1 + min) * canvas.height / 2);
        ctx.lineTo(i, (1 + max) * canvas.height / 2);
      }
      ctx.stroke();
    }
  }, [isPlaying, audioBuffer]);

  const handleFileChange = async (file) => {
    setUploadError('');
    if (!file) return;
    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      setUploadError('Only audio or video files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Voice file must be less than 10MB');
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('voice', file);
      const res = await fetch('/backend/profile/upload/voice', {
        method: 'POST',
        credentials: 'include',
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      onChange({ url: data.url, duration: '15' });
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

  const startRecording = async () => {
    setUploadError('');
    setNoAudioWarning(false);
    setRecordedChunks([]);
    setRecordedUrl('');
    setRecordingTime(0);
    setAudioBuffer(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const chunks = [];
      const recorder = new window.MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        if (!chunks.length) {
          setNoAudioWarning(true);
          setRecordedUrl('');
          setAudioBuffer(null);
          onChange({ url: '', duration: '' });
          return;
        }
        const blob = new Blob(chunks, { type: 'audio/webm' });
        if (blob.size === 0) {
          setNoAudioWarning(true);
          setRecordedUrl('');
          setAudioBuffer(null);
          onChange({ url: '', duration: '' });
          return;
        }
        setNoAudioWarning(false);
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setRecordedChunks([]);
        // decode audio for waveform
        const arrayBuffer = await blob.arrayBuffer();
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);
        setAudioBuffer(decoded);
        uploadRecordedAudio(blob);
        onChange({ duration: Math.min(recordingTime, 15).toString() });
      };
      recorder.start();
      setRecording(true);
      let time = 0;
      recordingInterval.current = setInterval(() => {
        time += 1;
        setRecordingTime(time);
        if (time >= 15) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      setUploadError('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setRecording(false);
    clearInterval(recordingInterval.current);
  };

  const rerecord = () => {
    setRecordedChunks([]);
    setRecordedUrl('');
    setAudioBuffer(null);
    onChange({ url: '', duration: '' });
    setRecordingTime(0);
    setUploadError('');
    setNoAudioWarning(false);
  };

  const uploadRecordedAudio = async (blob) => {
    setUploading(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('voice', blob, 'recording.webm');
      const res = await fetch('/backend/profile/upload/voice', {
        method: 'POST',
        credentials: 'include',
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      onChange({ url: data.url, duration: '15' });
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">
        Voice File (max 15s) or Record
      </label>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer mb-4
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
          accept="audio/*,video/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {value?.url ? (
          <div className="space-y-4">
            <audio
              controls
              src={value.url}
              className="w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            <p className="text-white/60 text-sm">Click to change file</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium mb-2">
                {isDragOver ? 'Drop your audio file here' : 'Drop audio files here or click to upload'}
              </p>
              <p className="text-white/60 text-sm">Supports: MP3, WAV, M4A, MP4</p>
            </div>
          </div>
        )}
      </div>
      
      {uploading && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 text-pink-400">
            <div className="w-4 h-4 border-2 border-pink-400/20 border-t-pink-400 rounded-full animate-spin"></div>
            <span className="text-sm">Uploading...</span>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="mb-4 text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-2">
          {uploadError}
        </div>
      )}
      
      <div className="mt-4">
        <label className="block text-white/80 text-sm font-medium mb-2">
          Or Record Voice (max 15s)
        </label>
        <div className="flex items-center space-x-3 mb-2">
          {!recording && !recordedUrl && (
            <button
              type="button"
              onClick={startRecording}
              disabled={recording || uploading}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Start Recording
            </button>
          )}
          {recording && (
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
            >
              Stop
            </button>
          )}
          {recordedUrl && !recording && (
            <button
              type="button"
              onClick={rerecord}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer"
            >
              Re-record
            </button>
          )}
          <span className="text-white/80">{recordingTime}s / 15s</span>
        </div>
        <canvas ref={canvasRef} width={300} height={60} className="w-full bg-white/10 rounded mb-2" />
        {noAudioWarning && (
          <div className="text-yellow-400 text-sm mb-2">No audio detected. Please try again and ensure your microphone is working.</div>
        )}
        {recordedUrl && (
          <audio
            controls
            src={recordedUrl}
            className="w-full mt-2"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        )}
      </div>
    </div>
  );
} 