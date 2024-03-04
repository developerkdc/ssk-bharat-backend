import express from "express";
import {
  LoginUser,
  getUserById,
} from "../../../controllers/OfflineStore/Auth/Auth.controller";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";
const router = express.Router();

router.post("/login", LoginUser);
// router.post("/forgotpassword", SendOTP);
// router.post("/verifyotp", VerifyOtp);
// router.post("/updatePassword", UpdatePassword);
router.get("/getUser", offlineStoreAuthMiddleware, getUserById);

export default router;
