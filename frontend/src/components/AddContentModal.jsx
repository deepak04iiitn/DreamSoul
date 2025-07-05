import React, { useState, useRef, useEffect } from 'react';

export default function AddContentModal({ isOpen, onClose, contentType, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    duration: '',
    content: '',
    caption: '',
    name: '',
    description: '',
    mediaType: '', // for hobbies: image or video
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedUrl, setRecordedUrl] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const recordingInterval = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);
  const streamRef = useRef(null);
  const [noAudioWarning, setNoAudioWarning] = useState(false);

  // Draw waveform during recording
  useEffect(() => {
    if (recording && streamRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(streamRef.current);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteTimeDomainData(dataArray);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ec4899';
        ctx.beginPath();
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        animationIdRef.current = requestAnimationFrame(draw);
      };
      draw();
      return () => {
        if (audioContextRef.current) audioContextRef.current.close();
        cancelAnimationFrame(animationIdRef.current);
      };
    }
  }, [recording]);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e) => {
    setUploadError('');
    setFile(null);
    setFormData({ ...formData, url: '', mediaType: '' });
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate file type and size
    if (contentType === 'photo') {
      if (!selected.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        return;
      }
      if (selected.size > 2 * 1024 * 1024) {
        setUploadError('Photo must be less than 2MB');
        return;
      }
    }
    if (contentType === 'voice') {
      if (!selected.type.startsWith('audio/') && !selected.type.startsWith('video/')) {
        setUploadError('Only audio or video files are allowed');
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setUploadError('Voice file must be less than 10MB');
        return;
      }
    }
    if (contentType === 'hobby') {
      if (!selected.type.startsWith('image/') && !selected.type.startsWith('video/')) {
        setUploadError('Only image or video files are allowed');
        return;
      }
      if (selected.type.startsWith('image/') && selected.size > 2 * 1024 * 1024) {
        setUploadError('Photo must be less than 2MB');
        return;
      }
    }

    setFile(selected);
    setUploading(true);
    try {
      let endpoint = '';
      let field = '';
      if (contentType === 'photo') {
        endpoint = '/backend/profile/upload/photo';
        field = 'photo';
      } else if (contentType === 'voice') {
        endpoint = '/backend/profile/upload/voice';
        field = 'voice';
      } else if (contentType === 'hobby') {
        endpoint = '/backend/profile/upload/hobby';
        field = 'media';
      }
      const form = new FormData();
      form.append(field, selected);
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: form
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('File upload failed:', data);
        throw new Error(data.message || 'Upload failed');
      }
      setFormData((prev) => ({
        ...prev,
        url: data.url,
        mediaType: data.type || '',
        duration: contentType === 'voice' ? '15' : prev.duration, // Default duration for voice files
      }));
      setUploading(false);
    } catch (err) {
      setUploadError(err.message);
      setUploading(false);
    }
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
          setFormData((prev) => ({ ...prev, url: '', duration: '' }));
          return;
        }
        const blob = new Blob(chunks, { type: 'audio/webm' });
        if (blob.size === 0) {
          setNoAudioWarning(true);
          setRecordedUrl('');
          setAudioBuffer(null);
          setFormData((prev) => ({ ...prev, url: '', duration: '' }));
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
        setFormData((prev) => ({ ...prev, duration: Math.min(recordingTime, 15).toString() }));
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
    setFormData((prev) => ({ ...prev, url: '', duration: '' }));
    setRecordingTime(0);
    setUploadError('');
    setNoAudioWarning(false);
  };

  const uploadRecordedAudio = async (blob) => {
    setUploading(true);
    setUploadError('');
    try {
      console.log('Uploading recorded audio, blob size:', blob.size);
      const form = new FormData();
      form.append('voice', blob, 'recording.webm');
      const res = await fetch('/backend/profile/upload/voice', {
        method: 'POST',
        credentials: 'include',
        body: form
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Voice upload failed:', data);
        throw new Error(data.message || 'Upload failed');
      }
      console.log('Voice upload successful:', data.url);
      setFormData((prev) => ({
        ...prev,
        url: data.url,
      }));
    } catch (err) {
      console.error('Voice upload error:', err);
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let endpoint = '';
      let payload = {};
      if (contentType === 'photo') {
        if (!formData.url) throw new Error('Please upload a photo');
        endpoint = '/backend/profile/photos';
        payload = { url: formData.url, caption: formData.caption };
      } else if (contentType === 'voice') {
        if (!formData.url) throw new Error('Please upload a voice file or record audio');
        if (!formData.title) throw new Error('Please enter a title for your voice');
        endpoint = '/backend/profile/voices';
        payload = { title: formData.title, url: formData.url, duration: formData.duration || '15' };
      } else if (contentType === 'thought') {
        endpoint = '/backend/profile/thoughts';
        payload = { content: formData.content };
      } else if (contentType === 'hobby') {
        if (!formData.url) throw new Error('Please upload a photo or video');
        endpoint = '/backend/profile/hobbies';
        payload = { name: formData.name, description: formData.description, url: formData.url, mediaType: formData.mediaType };
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add content');
      }
      onAdd(data);
      onClose();
      setFormData({
        title: '',
        url: '',
        duration: '',
        content: '',
        caption: '',
        name: '',
        description: '',
        mediaType: '',
      });
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        url: '',
        duration: '',
        content: '',
        caption: '',
        name: '',
        description: '',
        mediaType: '',
      });
      setFile(null);
      setRecordedChunks([]);
      setRecordedUrl('');
      setRecordingTime(0);
      setAudioBuffer(null);
      setUploadError('');
      setNoAudioWarning(false);
      setRecording(false);
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isOpen, mediaRecorder]);

  if (!isOpen) return null;

  const getModalContent = () => {
    switch (contentType) {
      case 'photo':
        return (
          <>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Photo (max 2MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-white mb-2"
              />
              {uploading && <div className="text-pink-400 text-sm">Uploading...</div>}
              {uploadError && <div className="text-red-400 text-sm">{uploadError}</div>}
              {formData.url && <img src={formData.url} alt="Preview" className="w-32 h-32 object-cover rounded-lg mt-2" />}
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Caption
              </label>
              <input
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Add a caption"
              />
            </div>
          </>
        );
      case 'voice':
        return (
          <>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Voice File (max 15s) or Record
              </label>
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileChange}
                className="w-full text-white mb-4"
              />
              {uploading && <div className="text-pink-400 text-sm">Uploading...</div>}
              {uploadError && <div className="text-red-400 text-sm">{uploadError}</div>}
              {formData.url && (
                <audio
                  controls
                  src={formData.url}
                  className="w-full mt-2"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
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
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
                    >
                      Start Recording
                    </button>
                  )}
                  {recording && (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Stop
                    </button>
                  )}
                  {recordedUrl && !recording && (
                    <button
                      type="button"
                      onClick={rerecord}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
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
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Enter voice title"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Duration (seconds)
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="e.g., 15"
                readOnly
              />
            </div>
          </>
        );
      case 'thought':
        return (
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Thought *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors resize-none"
              placeholder="Share your thought..."
            />
          </div>
        );
      case 'hobby':
        return (
          <>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Hobby Media (photo max 2MB, video max 10s)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full text-white mb-2"
              />
              {uploading && <div className="text-pink-400 text-sm">Uploading...</div>}
              {uploadError && <div className="text-red-400 text-sm">{uploadError}</div>}
              {formData.url && formData.mediaType === 'image' && (
                <img src={formData.url} alt="Preview" className="w-32 h-32 object-cover rounded-lg mt-2" />
              )}
              {formData.url && formData.mediaType === 'video' && (
                <video src={formData.url} controls className="w-32 h-32 object-cover rounded-lg mt-2" />
              )}
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Hobby Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                placeholder="Enter hobby name"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors resize-none"
                placeholder="Describe your hobby..."
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (contentType) {
      case 'photo': return 'Add Photo';
      case 'voice': return 'Add Voice';
      case 'thought': return 'Add Thought';
      case 'hobby': return 'Add Hobby';
      default: return 'Add Content';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{getTitle()}</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {getModalContent()}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || (contentType === 'voice' && !formData.url)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 