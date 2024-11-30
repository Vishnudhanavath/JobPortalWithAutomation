import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";
import {v2 as cloudinary} from "cloudinary";


export const applyForJob = async(req,res) => {
    try{
        const {id} = req.params;
        let jobId = id;
        // console.log(jobId);
        if(!jobId) {
            return res.status(400).json({
                message:"jobId is required",
                success:false 
            });
        }
        const job = await Job.findById(jobId);
        // console.log(job);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false,
            });
        }

        const applicant = req.user;
        // check whether the user is already applied for this before or not;
        const isExistingApplication = await Application.findOne({applicant: applicant._id,job:jobId});

        if(isExistingApplication){
            return res.status(400).json({
                message:"You have already applied for this job",
            });
        }
        const applicantData = {
            applicant,
            job:jobId
        }
        // resume 
        if(req.files && req.files.resume){
            const{resume} = req.files;
            const uploadedResume = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "Resume" });
            applicantData.resume = {
                public_id:uploadedResume.public_id,
                url:uploadedResume.secure_url
            }
        }
        const application = await Application.create(applicantData);
        return res.status(200).json({
             message:"Application is  submitted successfully",
             success:true,
             application,
        });

    }catch(error){
        console.error("Error applying for job:", error);
        res.status(500).json({
            message: "An error occurred while applying for the job.",
            success: false,
        });
    }
}
// Get all applications for a recruiter
export const getApplicationsForJob = async(req,res) => {
       try{
            const recruiterJobs = await Job.find({postedBy:req.user});
            const applications = await Application.find({ job: { $in: recruiterJobs.map(job => job._id) } })
            .populate("applicant", "fullName email")
            .populate("job", "title");
            return res.status(200).json({
                success: true,
                applications,
                count: applications.length,
            });  
       }catch(error){
        console.error("Error fetching applications:", error);
        res.status(500).json({
            message: "An error occurred while fetching applications.",
            success: false,
        });
       }
}
export const jobSeekerGetAllApplication = async(req,res) => {
        try{
            const applications = await Application.find({applicant:req.user})
            .populate("job", "title companyName location");
            return res.status(200).json({
                success: true,
                applications,
                count: applications.length,
            });

        }catch(error){
            console.error("Error fetching user's applications:", error);
            res.status(500).json({
                message: "An error occurred while fetching your applications.",
                success: false,
            });
        }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

     
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
};




export const deleteApplication = async (req,res) => {
    try {
        const applicationId  = req.params.id;

        const application = await Application.findOne({_id:applicationId});
        
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false,
            });
        }
        await application.deleteOne();

        return res.status(200).json({
            message: "Application deleted successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({
            message: "An error occurred while deleting the application.",
            success: false,
        });
    }
};
