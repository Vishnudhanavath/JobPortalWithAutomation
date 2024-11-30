import express from "express";
import { postJob,getMyJobs,deleteJob,getAllJobs,getSingleJob} from "../controllers/jobControllers.js";
import {isAuthenticated,isAuthorized} from "../middlewares/Auth.js"

const router = express.Router();

router.post("/post",isAuthenticated,isAuthorized("recruiter"),postJob);
router.get("/getalljobs",getAllJobs);
router.get("/getmyjobs",isAuthenticated,isAuthorized("recruiter"),getMyJobs);
router.delete("/delete/:id",isAuthenticated,isAuthorized("recruiter"),deleteJob);
router.get("/get/:id", getSingleJob) 
export default router;

