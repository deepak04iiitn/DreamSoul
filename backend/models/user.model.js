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