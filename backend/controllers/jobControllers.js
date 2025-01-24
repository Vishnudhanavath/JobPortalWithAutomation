import { Job } from "../models/jobSchema.js";

// Post Job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities,
      qualifications,
      offers,
      salary,
      hiringMultipleCandidates,
      personalWebsiteTitle,
      personalWebsiteUrl,
      jobNiche,
    } = req.body;

    // Validation for required fields
    if (
      !title ||
      !jobType ||
      !location ||
      !companyName ||
      !introduction ||
      !responsibilities ||
      !qualifications ||
      !salary ||
      !jobNiche
    ) {
      return res.status(400).json({
        message: "Please provide full job details.",
        success: false,
      });
    }

    // Validation for personal website fields
    if (
      (personalWebsiteTitle && !personalWebsiteUrl) ||
      (!personalWebsiteTitle && personalWebsiteUrl)
    ) {
      return res.status(400).json({
        message: "Provide both the website URL and title, or leave both blank.",
        success: false,
      });
    }

    // Getting user ID for the job post
    const postedBy = req.user._id;

    // Creating the job post
    const job = await Job.create({
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities,
      qualifications,
      offers,
      salary,
      hiringMultipleCandidates,
      personalWebsite: {
        title: personalWebsiteTitle,
        url: personalWebsiteUrl,
      },
      jobNiche,
      postedBy,
    });

    // Responding with success message and job details
    return res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Get All Jobs (with filters)
export const getAllJobs = async (req, res) => {
  try {
    const { city, niche, searchKeyword } = req.query;
    const query = {};

    if (city) {
      query.location = { $regex: city, $options: "i" }; // Case-insensitive search
    }
    if (niche) {
      query.jobNiche = { $regex: niche, $options: "i" };
    }
    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { companyName: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query);
    return res.status(200).json({
      success: true,
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Get My Jobs (only for the user who posted)
export const getMyJobs = async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    return res.status(200).json({
      success: true,
      myJobs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Delete Job (only by the user who posted it)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Deleting the job
    await job.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Get a Single Job (by ID)
export const getASingleJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
