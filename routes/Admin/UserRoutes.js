import express from "express";
import {
  AddUser,
  ChangePassword,
  EditUser,
  FetchUsers,

} from "../../controllers/Admin/userController";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"
import authMiddleware from "../../middlewares/adminAuth";

const router = express.Router();


router.post("/adduser",rolesPermissions("user", "add"), AddUser);
router.patch("/edituser/:userId", rolesPermissions("user", "edit"), EditUser);
router.patch("/:userId/changepassword", ChangePassword);
router.get("/userslist",authMiddleware, rolesPermissions("user", "view"), FetchUsers);

export default router;
