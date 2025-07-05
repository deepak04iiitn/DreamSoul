import { getUserModel, findUserByEmail } from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';

// Multer setup for memory storage
const storage = multer.memoryStorage();

// Different upload configurations for different file types
const photoUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB for photos
  },
});

const voiceUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB for voice files
  },
});

const hobbyUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB for hobby media
  },
});

// Helper for uploading to Cloudinary
async function uploadToCloudinary(buffer, folder, resource_type = 'image', options = {}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        ...options
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    ).end(buffer);
  });
}

// Get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { user, model } = await findUserByEmail(email);
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Complete profile
export const completeProfile = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { user, model } = await findUserByEmail(email);
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const {
            age,
            city,
            state,
            country,
            interestedIn,
            bio,
            introVoice,
            introHobby,
            introThought
        } = req.body;

        // Validate required fields
        if (!age || !city || !state || !country || !interestedIn || !bio) {
            return next(errorHandler(400, "All fields are required for profile completion"));
        }

        // Update user profile
        const updatedUser = await model.findByIdAndUpdate(
            user._id,
            {
                age,
                city,
                state,
                country,
                interestedIn,
                bio,
                introVoice,
                introHobby,
                introThought,
                isProfileComplete: true
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile completed successfully",
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

// Add voice
export const addVoice = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { user, model } = await findUserByEmail(email);
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const { title, url, duration } = req.body;

        if (!title || !url || !duration) {
            return next(errorHandler(400, "Title, URL, and duration are required"));
        }

        const newVoice = {
            title,
            url,
            duration,
            plays: 0
        };

        const updatedUser = await model.findByIdAndUpdate(
            user._id,
            { $push: { allVoices: newVoice } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Voice added successfully",
            voice: newVoice
        });
    } catch (error) {
        next(error);
    }
};

// Add hobby
export const addHobby = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { user, model } = await findUserByEmail(email);
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const { name, description } = req.body;

        if (!name || !description) {
            return next(errorHandler(400, "Name and description are required"));
        }

        const newHobby = {
            name,
            description
        };

        const updatedUser = await model.findByIdAndUpdate(
            user._id,
            { $push: { allHobbies: newHobby } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Hobby added successfully",
            hobby: newHobby
        });
    } catch (error) {
        next(error);
    }
};

// Add thought
export const addThought = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { user, model } = await findUserByEmail(email);
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const { content } = req.body;

        if (!content) {
            return next(errorHandler(400, "Content is required"));
        }

        const newThought = {
            content,
            likes: 0,
            comments: 0
        };

        const updatedUser = await model.findByIdAndUpdate(
            user._id,
            { $push: { allThoughts: newThought } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Thought added successfully",
            thought: newThought
        });
    } catch (error) {
        next(error);
    }
};

// Add photo
export const addPhoto = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { user, model } = await findUserByEmail(email);
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const { url, caption } = req.body;

        if (!url) {
            return next(errorHandler(400, "Photo URL is required"));
        }

        const newPhoto = {
            url,
            caption: caption || "",
            likes: 0
        };

        const updatedUser = await model.findByIdAndUpdate(
            user._id,
            { $push: { allPhotos: newPhoto } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Photo added successfully",
            photo: newPhoto
        });
    } catch (error) {
        next(error);
    }
};

// Delete content items
export const deleteContent = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { user, model } = await findUserByEmail(email);
        const { contentType, contentId } = req.params;
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        let updateQuery = {};
        
        switch (contentType) {
            case 'voice':
                updateQuery = { $pull: { allVoices: { _id: contentId } } };
                break;
            case 'hobby':
                updateQuery = { $pull: { allHobbies: { _id: contentId } } };
                break;
            case 'thought':
                updateQuery = { $pull: { allThoughts: { _id: contentId } } };
                break;
            case 'photo':
                updateQuery = { $pull: { allPhotos: { _id: contentId } } };
                break;
            default:
                return next(errorHandler(400, "Invalid content type"));
        }

        const updatedUser = await model.findByIdAndUpdate(
            user._id,
            updateQuery,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `${contentType} deleted successfully`
        });
    } catch (error) {
        next(error);
    }
};

// New: Upload photo (max 2MB)
export const uploadPhoto = [
  photoUpload.single('photo'),
  async (req, res, next) => {
    try {
      if (!req.file) return next(errorHandler(400, 'No file uploaded'));
      if (req.file.size > 2 * 1024 * 1024) return next(errorHandler(400, 'Photo must be less than 2MB'));
      const result = await uploadToCloudinary(req.file.buffer, 'DreamSoul/photos', 'image');
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      next(error);
    }
  }
];

// New: Upload voice (max 15s, audio only)
export const uploadVoice = [
  voiceUpload.single('voice'),
  async (req, res, next) => {
    try {
      if (!req.file) return next(errorHandler(400, 'No file uploaded'));
      
      // Validate file type
      if (!req.file.mimetype.startsWith('audio/') && !req.file.mimetype.startsWith('video/')) {
        return next(errorHandler(400, 'Only audio or video files are allowed for voice upload'));
      }
      
      // Upload to Cloudinary with appropriate resource type
      const result = await uploadToCloudinary(req.file.buffer, 'DreamSoul/voices', 'video', {
        resource_type: 'video',
        transformation: [{ duration: 15 }],
      });
      
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      next(error);
    }
  }
];

// New: Upload hobby media (photo or video, max 2MB for photo, max 10s for video)
export const uploadHobbyMedia = [
  hobbyUpload.single('media'),
  async (req, res, next) => {
    try {
      if (!req.file) return next(errorHandler(400, 'No file uploaded'));
      if (req.file.mimetype.startsWith('image/')) {
        if (req.file.size > 2 * 1024 * 1024) return next(errorHandler(400, 'Photo must be less than 2MB'));
        const result = await uploadToCloudinary(req.file.buffer, 'DreamSoul/hobbies', 'image');
        res.status(200).json({ url: result.secure_url, type: 'image' });
      } else if (req.file.mimetype.startsWith('video/')) {
        const result = await uploadToCloudinary(req.file.buffer, 'DreamSoul/hobbies', 'video', {
          resource_type: 'video',
          transformation: [{ duration: 10, flags: 'truncate' }],
        });
        res.status(200).json({ url: result.secure_url, type: 'video' });
      } else {
        return next(errorHandler(400, 'Only image or video allowed for hobby media'));
      }
    } catch (error) {
      next(error);
    }
  }
]; 