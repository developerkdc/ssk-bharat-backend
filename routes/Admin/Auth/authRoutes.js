import express from "express";
import {
  LoginUser,
  SendOTP,
  UpdatePassword,
  VerifyOTPAndUpdatePassword,
  VerifyOtp,
  getUserById,
} from "../../../controllers/Admin/Auth/authController";
import authMiddleware from "../../../middlewares/adminAuth";

const router = express.Router();

router.post("/login", LoginUser);
router.post("/forgotpassword", SendOTP);
router.post("/verifyotp", VerifyOtp);
router.post("/updatePassword", UpdatePassword);
router.get("/getUser/:id", authMiddleware, getUserById);

export default router;
