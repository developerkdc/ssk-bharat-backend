import express from "express";
import { LoginUser } from "../../../controllers/OfflineStore/Auth/Auth.controller";
const router = express.Router();

router.post("/login", LoginUser);
// router.post("/forgotpassword", SendOTP);
// router.post("/verifyotp", VerifyOtp);
// router.post("/updatePassword", UpdatePassword);
// router.get("/getUser/:id", authMiddleware, getUserById);

export default router;