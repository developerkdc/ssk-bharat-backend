import express from "express";
import {
  METLoginUser, METSendOTP, METUpdatePassword, METVerifyOtp,
} from "../../controllers/MET/METAuth/metAuthController";

const METAuthRouter = express.Router();

METAuthRouter.post("/login", METLoginUser);
METAuthRouter.get("/forgotpassword", METSendOTP);
METAuthRouter.get("/verifyotp", METVerifyOtp);
METAuthRouter.post("/updatePassword", METUpdatePassword);

export default METAuthRouter;
