import express from "express";
import {
  METLoginUser, METSendOTP, METVerifyOTPAndUpdatePassword,
} from "../../controllers/METAuth/metAuthController";

const router = express.Router();

router.post("/login", METLoginUser);
router.get("/forgotpassword", METSendOTP);
router.get("/verifyotp", METVerifyOTPAndUpdatePassword);

export default router;
