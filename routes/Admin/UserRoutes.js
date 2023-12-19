import express from "express";
import { AddUser, ChangePassword, EditUser, LoginUser } from "../../controllers/Admin/userController";
const router = express.Router();


router.get('/login',LoginUser);
router.post("/adduser", AddUser);
router.patch("/edituser/:userId", EditUser);
router.patch("/:userId/changepassword", ChangePassword);

export default router;