import express from "express";
import { LoginUser, SendOTP, VerifyOTPAndUpdatePassword } from "../../controllers/Admin/authController";


const router = express.Router();

router.post("/login", LoginUser);
router.get("/forgotpassword", SendOTP);
router.get("/verifyotp", VerifyOTPAndUpdatePassword);


export default router;