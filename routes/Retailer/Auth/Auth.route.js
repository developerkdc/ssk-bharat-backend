import express from "express";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";
import { LoginUser, getUserById } from "../../../controllers/Retailers/Auth/Auth.controller";
const router = express.Router();

router.post("/login", LoginUser);
// router.post("/forgotpassword", SendOTP);
// router.post("/verifyotp", VerifyOtp);
// router.post("/updatePassword", UpdatePassword);
router.get("/getUser", retailersAuthMiddleware, getUserById);

export default router;
