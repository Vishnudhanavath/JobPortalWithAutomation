import express from "express";
import { isAuthenticated,isAuthorized } from "../middlewares/Auth.js";
import {applyForJob,getApplicationsForJob,jobSeekerGetAllApplication,updateApplicationStatus, deleteApplication } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/apply/:id", isAuthenticated,isAuthorized("job Seeker"),applyForJob);
router.get("/recruiter/getall",isAuthenticated,isAuthorized("recruiter"),getApplicationsForJob);
router.get("/jobseeker/getall",isAuthenticated,isAuthorized("job Seeker"),jobSeekerGetAllApplication);
router.put("/updatestatus/:id",isAuthenticated,isAuthorized("recruiter"),updateApplicationStatus);
router.delete("/delete/:id", isAuthenticated, deleteApplication);

export default router;
