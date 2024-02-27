import express from "express";
import {
  METLoginUser, METSendOTP, METUpdatePassword, METVerifyOtp,
} from "../../../controllers/MET/METAuth/metAuthController";

const METAuthRouter = express.Router();

METAuthRouter.post("/login", METLoginUser);
METAuthRouter.post("/forgotpassword", METSendOTP);
METAuthRouter.post("/verifyotp", METVerifyOtp);
METAuthRouter.post("/updatePassword", METUpdatePassword);

export default METAuthRouter;
