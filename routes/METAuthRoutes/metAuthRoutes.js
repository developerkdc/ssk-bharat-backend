import express from "express";
import {
  METLoginUser, METSendOTP,
} from "../../controllers/METAuth/metAuthController";

const router = express.Router();

router.post("/login", METLoginUser);
router.get("/forgotpassword", METSendOTP);
// router.get("/verifyotp", VerifyOTPAndUpdatePassword);

export default router;
