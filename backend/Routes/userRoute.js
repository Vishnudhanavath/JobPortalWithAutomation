import express from "express"
import { logout,login, register,updateProfile,updatePassword} from "../controllers/userControllers.js";
import { isAuthenticated} from "../middlewares/Auth.js";

const router = express.Router();

router.post("/register",register); //  here register is a function
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.put("/update/profile",isAuthenticated,updateProfile);
router.put("/update/password",isAuthenticated,updatePassword);

export default router;