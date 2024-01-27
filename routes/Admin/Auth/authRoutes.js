import express from "express";
import {
  LoginUser,
  SendOTP,
  VerifyOTPAndUpdatePassword,
  getUserById,
} from "../../../controllers/Admin/Auth/authController";
import authMiddleware from "../../../middlewares/adminAuth";

const router = express.Router();

router.post("/login", LoginUser);
router.get("/forgotpassword", SendOTP);
router
  .get("/verifyotp", VerifyOTPAndUpdatePassword)
  .get("/getUser/:id", authMiddleware, getUserById);

export default router;
