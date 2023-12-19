import express from "express";
import { AddUser, ChangePassword, EditUser, FetchUsers, LoginUser } from "../../controllers/Admin/userController";
const router = express.Router();


router.get('/login',LoginUser);
router.post("/adduser", AddUser);
router.patch("/edituser/:userId", EditUser);
router.patch("/:userId/changepassword", ChangePassword);
router.get("/userslist", FetchUsers);

export default router;