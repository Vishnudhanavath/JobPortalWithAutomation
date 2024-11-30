import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary"


//register
export const register = async(req,res,next) =>{
    try{
        const {fullName, email,phoneNumber,address,role,password,firstNiche,secondNiche,thirdNiche} = req.body;
        console.log(req.body);
        if(!fullName || !email || !phoneNumber || !password || !role || !address){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            });
        }
        if(role === "job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
            return res.status(400).json({
                message:"Please provide your preferried niches.",
                success:false
            });
        }

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                message:"User is already exists with this email.",
                success:false
            });
        }
        // bcrypting password;
        const hashedPassword = await bcrypt.hash(password,10);
        console.log(password);
        console.log(hashedPassword);
        const userDetails = {fullName,
             email,
             phoneNumber,
             address,
             role,
             password:hashedPassword,
             niches:{
                firstNiche,
                secondNiche,
                thirdNiche
             }
            };
        if(req.files && req.files.resume){
            const  {resume} = req.files;
            if(resume){
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath,
                            {folder:"Resume"}
                    );
                    if(cloudinaryResponse || cloudinaryResponse.error){
                        return res.status(500).json({
                            message:"Failed to upload resume to cloud",
                            success:false
                        });
                    }
                    userDetails.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url,
                    };

                } catch (error) {
                    return res.status(500).json({
                        message:"Failed to upload resume",
                        success:false
                    })
                }
            }
        }
        const user = await User.create(userDetails);
        return res.status(201).json({
            message:"Account is created Successfully.",
            success:true
        })

    }catch(error){
        next(error);
    }

}

//login
export const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required",
                success: false
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email",
                success: false
            });
        }

        // Log for debugging
        // console.log("Entered password:", password);
        // console.log("Stored hashed password:", user.password);

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid password",
                success: false
            });
        }

        // Check if role matches
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the specified role",
                success: false
            });
        }

        const tokenData = {
            userId: user._id,
            role:user.role,
            email: user.email
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '7d' });

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
        };

        return res.status(200).cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        }).json({
            message: `Welcome back ${user.fullName}`,
            user: userResponse,
            success: true
        });

    } catch (error) {
        console.error("Login error: ", error);
        return res.status(500).json({
            message: "An error occurred while logging in",
            success: false
        });
    }
};
//logOut
export const logout = async(req,res) =>{
    try{
        return res.status(200).cookie("token","",{maxAge: 0}).json({
            message:"loged out successfully",
            success:true
        });
    }catch(error){
        console.log(error);
    }
};

//updateProfile details;
export const updateProfile = async(req,res,next) =>{
    try {
        const { fullName, email, phoneNumber, bio, skills, address, role, firstNiche, secondNiche, thirdNiche } = req.body;

        const newUserDetails = {
            fullName,
            email,
            phoneNumber,
            "profile.bio": bio,
            "profile.skills": skills ? skills.split(",") : undefined,
            address,
            niches: { firstNiche, secondNiche, thirdNiche },
        };

        if(role === "job Seeker" && (!firstNiche|| !secondNiche || !thirdNiche)){
            return res.status(400).json({
                message:"Please provide all the job niches",
                success:false
            })
        }
        
        if(req.files && req.files.resume){
            const {resume} = req.files;
                const resumeId = req.user.resume.public_id;
                if(resumeId){ // remove fromt he cloudinary
                    await cloudinary.uploader.destroy(resumeId);
                }
                    // creates the newResume
                const newResume = await cloudinary.uploader.upload(resume.tempFilePath,{
                    folder:"Resume"
                });
                newUserDetails.resume = {
                    public_id: newResume.public_id,
                    url: newResume.secure_url,
                };
        }

        if (req.files && req.files.profilePhoto) {
            if (req.user.profile.profilePhoto) {
                await cloudinary.uploader.destroy(req.user.profile.profilePhoto.public_id);
            }
            const uploadedPhoto = await cloudinary.uploader.upload(req.files.profilePhoto.tempFilePath, {
                folder: "ProfilePhotos",
            });
            newUserDetails["profile.profilePhoto"] = uploadedPhoto.secure_url;
        }

        const userId = req.id;
        // middleWare Authentication
        const user = await User.findByIdAndUpdate(userId, newUserDetails, { new: true });

        if(!user){
            return res.status(404).json({
                message: "User not found",
                success:false
            })
        }
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user,
        });


    }catch (error) {
        console.error("Error in updateProfile function:", error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
        });
    }
}


export const updatePassword = async (req, res, next) => {
    try {
        // Fetch user using the userId from the decoded token (which is in req.id)
        const user = await User.findById(req.id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Old password is incorrect.",
                success: false
            });
        }

        // Check if the new password and confirm password match
        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).json({
                message: "New password & confirm password do not match.",
                success: false
            });
        }

        const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        
        user.password = newHashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password updated successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
};
