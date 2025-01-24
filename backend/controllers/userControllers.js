import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Register
export const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            password,
            role,
            firstNiche,
            secondNiche,
            thirdNiche,
        } = req.body;

        // Validation: Required fields
        if (!name || !email || !phone || !address || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }
        if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
            return res.status(400).json({
                message: "Please provide your preferred job niches.",
                success: false,
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered.",
                success: false,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare user details
        const userData = {
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            role,
            niches: {
                firstNiche,
                secondNiche,
                thirdNiche,
            },
        };

        // Resume Upload
        if (req.files?.resume) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
                    folder: "Job_Seekers_Resume",
                });

                // Check if the response from Cloudinary is valid
                if (!cloudinaryResponse || cloudinaryResponse.error) {
                    return res.status(500).json({
                        message: "Failed to upload resume to cloud",
                        success: false,
                    });
                }

                userData.resume = {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                };
            } catch (error) {
                console.error("Resume upload error:", error);
                return res.status(500).json({
                    message: "Failed to upload resume",
                    success: false,
                });
            }
        }

        // Create user
        const user = await User.create(userData);

        // Send token (assuming sendToken function exists)
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });
        res.status(201).json({
            message: "User registered successfully.",
            success: true,
            token,
        });

    } catch (error) {
        console.error("Register error:", error);
        next(error);
    }
};

// Login
export const login = async (req, res, next) => {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
        return res.status(400).json({
            message: "Email, password, and role are required.",
            success: false,
        });
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password.",
                success: false,
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Invalid email or password.",
                success: false,
            });
        }

        if (user.role !== role) {
            return res.status(400).json({
                message: "Invalid user role.",
                success: false,
            });
        }

        // Send token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });
        res.status(200).json({
            message: "User logged in successfully.",
            success: true,
            token,
        });

    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
};

// Logout
export const logout = async (req, res, next) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
        }).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        console.error("Logout error:", error);
        next(error);
    }
};

// Update Profile
export const updateProfile = async (req, res, next) => {
    try {
        const { name, email, phone, address, firstNiche, secondNiche, thirdNiche } = req.body;

        // Validation for job seekers
        if (req.user.role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
            return res.status(400).json({
                message: "Please provide all preferred job niches.",
                success: false,
            });
        }

        const newUserData = {
            name,
            email,
            phone,
            address,
            niches: { firstNiche, secondNiche, thirdNiche },
        };

        // Resume Upload
        if (req.files?.resume) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
                    folder: "Job_Seekers_Resume",
                });

                if (req.user.resume?.public_id) {
                    await cloudinary.uploader.destroy(req.user.resume.public_id);
                }

                newUserData.resume = {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                };
            } catch (error) {
                console.error("Resume update error:", error);
                return res.status(500).json({
                    message: "Failed to update resume",
                    success: false,
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, { new: true });
        res.status(200).json({
            message: "Profile updated successfully.",
            success: true,
            user: updatedUser,
        });

    } catch (error) {
        console.error("Update Profile error:", error);
        next(error);
    }
};

// Update Password
export const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Old password is incorrect.",
                success: false,
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New password & confirm password do not match.",
                success: false,
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });
        res.status(200).json({
            message: "Password updated successfully.",
            success: true,
            token,
        });

    } catch (error) {
        console.error("Password update error:", error);
        next(error);
    }
};

// Get User Profile
export const getUser = async (req, res, next) => {
    try {

        const user = req.user;
        
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        res.status(200).json({
            message: "User retrieved successfully.",
            success: true,
            user,
        });

    } catch (error) {
        console.error("Get user error:", error);
        next(error);
    }
};
