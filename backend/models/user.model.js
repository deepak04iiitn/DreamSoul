import mongoose from "mongoose";

const baseUserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    profilePicture: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile.png",
    },
    isUserAdmin: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: "Inactive",
        enum: ["Active", "Inactive"]
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },
    // Profile completion fields
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    age: {
        type: Number,
        min: 18,
        max: 100,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    interestedIn: {
        type: String,
        enum: ["male", "female", "both", "others"],
    },
    bio: {
        type: String,
        maxLength: 500,
    },
    // Intro content
    introVoice: {
        type: String, // URL to voice file
    },
    introHobby: {
        type: String,
    },
    introThought: {
        type: String,
    },
    // All content arrays
    allVoices: [{
        title: String,
        url: String,
        duration: String,
        plays: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
    }],
    allHobbies: [{
        name: String,
        description: String,
        url: String,
        mediaType: String,
        createdAt: { type: Date, default: Date.now }
    }],
    allThoughts: [{
        title: { type: String, required: true },
        content: String,
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
    }],
    allPhotos: [{
        url: String,
        caption: String,
        likes: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Create separate models for each gender
const MaleUser = mongoose.model('MaleUser', baseUserSchema);
const FemaleUser = mongoose.model('FemaleUser', baseUserSchema);
const OtherUser = mongoose.model('OtherUser', baseUserSchema);

// Export all models
export { MaleUser, FemaleUser, OtherUser };

// For backward compatibility, export a function to get the appropriate model
export const getUserModel = (gender) => {
    switch (gender) {
        case 'male':
            return MaleUser;
        case 'female':
            return FemaleUser;
        case 'other':
            return OtherUser;
        default:
            throw new Error('Invalid gender specified');
    }
};

// Export a function to search across all collections
export const findUserByEmail = async (email) => {
    let user = await MaleUser.findOne({ email });
    if (user) return { user, model: MaleUser };
    
    user = await FemaleUser.findOne({ email });
    if (user) return { user, model: FemaleUser };
    
    user = await OtherUser.findOne({ email });
    if (user) return { user, model: OtherUser };
    
    return { user: null, model: null };
};

// Export a function to search across all collections by username
export const findUserByUsername = async (username) => {
    let user = await MaleUser.findOne({ username });
    if (user) return { user, model: MaleUser };
    user = await FemaleUser.findOne({ username });
    if (user) return { user, model: FemaleUser };
    user = await OtherUser.findOne({ username });
    if (user) return { user, model: OtherUser };
    return { user: null, model: null };
};

// Export a function to search users by username prefix (autocomplete)
export const searchUsersByUsername = async (query, limit = 10) => {
    const regex = new RegExp('^' + query, 'i');
    const users = await Promise.all([
        MaleUser.find({ username: regex }).limit(limit),
        FemaleUser.find({ username: regex }).limit(limit),
        OtherUser.find({ username: regex }).limit(limit)
    ]);
    // Flatten and sort by username
    return users.flat().sort((a, b) => a.username.localeCompare(b.username)).slice(0, limit);
};