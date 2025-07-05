import { getUserModel, findUserByEmail } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    
    const { fullName, username, email, password, gender } = req.body;

    if(!fullName || !username || !email || !password || !gender || 
       fullName === '' || username === '' || email === '' || password === '' || gender === '') {
        return next(errorHandler(400, 'All fields are required!'));
    }

    // Validate gender
    if (!['male', 'female', 'other'].includes(gender)) {
        return next(errorHandler(400, 'Gender must be male, female, or other!'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
        // Get the appropriate model based on gender
        const UserModel = getUserModel(gender);
        
        const newUser = new UserModel({
            fullName,
            username,
            email,
            password: hashedPassword,
            gender,
        });

        await newUser.save();

        res.json('Signup successful!');

    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required!'));
    }

    try {
        // Search for user across all collections
        const { user: validUser, model: UserModel } = await findUserByEmail(email);

        if (!validUser) {
            return next(errorHandler(404, 'Invalid credentials!'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(400, 'Invalid credentials!'));
        }

        const token = jwt.sign(
            { 
                id: validUser._id,
                email: validUser.email,
                isUserAdmin: validUser.isUserAdmin,
                gender: validUser.gender
            },
            process.env.JWT_SECRET
        );

        const { password: pass, ...rest } = validUser._doc;

        res.status(200)
           .cookie('access_token', token, {
                httpOnly: true
           })
           .json(rest);

    } catch (error) {
        next(error);
    }
}

export const google = async(req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;

    try {
        // Search for user across all collections
        const { user, model: UserModel } = await findUserByEmail(email);

        if (user) {
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    isUserAdmin: user.isUserAdmin,
                    gender: user.gender
                },
                process.env.JWT_SECRET
            );

            const { password, ...rest } = user._doc;

            res.status(200)
               .cookie('access_token', token, {
                    httpOnly: true
               })
               .json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + 
                                    Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            // For Google auth, we'll default to 'other' gender since we don't have this info
            const UserModel = getUserModel('other');

            const newUser = new UserModel({
                fullName: name,
                username: name.toLowerCase().split(' ').join('') + 
                         Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                gender: 'other',
                isUserAdmin: false
            });

            await newUser.save();

            const token = jwt.sign(
                {
                    id: newUser._id,
                    email: newUser.email,
                    isUserAdmin: newUser.isUserAdmin,
                    gender: newUser.gender
                },
                process.env.JWT_SECRET
            );

            const { password, ...rest } = newUser._doc;

            res.status(200)
               .cookie('access_token', token, {
                    httpOnly: true
               })
               .json(rest);
        }
    } catch (error) {
        next(error);
    }
}