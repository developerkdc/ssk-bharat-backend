import express from "express";
const router = express.Router();

import userController from "../../controllers/Admin/userController.js";
import Auth from "../../middlewares/adminAuth.js";

router.post('/login',Auth, userController.LoginUser);
// router.get('/detail', auth, user_controller.GetDetail);
// router.get('/logout', auth, user_controller.Logout);
// router.post('/update', upload.single('profile_pic'), auth, login_rules.update(), user_controller.UpdateUser);
// router.post('/create', upload.single('profile_pic'), auth, login_rules.create(), user_controller.Store);
// router.delete('/delete', auth, user_controller.Delete);
// router.get('/list', auth, user_controller.List);
// router.post('/change-password', auth, login_rules.ChangePassword(), user_controller.ChangePassword);
// router.post('/send/forget-password-otp', login_rules.SendForgetPasswordOtp(), user_controller.SendForgetPasswordOtp);
// router.post('/verify/otp', login_rules.VerifyOtp(), user_controller.VerifyOtp);
// router.post('/reset-password', login_rules.ResetPassword(), user_controller.ResetPassword);
// router.get('/role-list', auth, user_controller.RoleNameList);
// router.post('/verify-user', user_controller.VerifyUser);

export default router;