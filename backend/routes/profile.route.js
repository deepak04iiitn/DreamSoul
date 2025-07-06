import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    getUserProfile,
    completeProfile,
    addVoice,
    addHobby,
    addThought,
    addPhoto,
    deleteContent,
    uploadPhoto,
    uploadVoice,
    uploadHobbyMedia,
    getUserProfileByUsername,
    searchUsernames,
    uploadProfilePicture
} from '../controllers/profile.controller.js';

const router = express.Router();

// Public: Get user profile by username
router.get('/public/:username', getUserProfileByUsername);

// Public: Search users by username (autocomplete)
router.get('/search', searchUsernames);

// All routes below require authentication
router.use(verifyToken);

// Get user profile
router.get('/me', getUserProfile);

// Complete profile
router.post('/complete', completeProfile);

// Upload endpoints
router.post('/upload/photo', ...uploadPhoto);
router.post('/upload/voice', ...uploadVoice);
router.post('/upload/hobby', ...uploadHobbyMedia);
router.post('/upload/profile-picture', ...uploadProfilePicture);

// Add content
router.post('/voices', addVoice);
router.post('/hobbies', addHobby);
router.post('/thoughts', addThought);
router.post('/photos', addPhoto);

// Delete content
router.delete('/:contentType/:contentId', deleteContent);

export default router; 