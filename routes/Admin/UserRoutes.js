import express from "express";
import {
  AddUser,
  ChangePassword,
  EditUser,
  FetchUsers,
  LoginUser,
} from "../../controllers/Admin/userController";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"

const router = express.Router();

router.get("/login", LoginUser);
router.post("/adduser", rolesPermissions("user", "add"), AddUser);
router.patch("/edituser/:userId", rolesPermissions("user", "edit"), EditUser);
router.patch("/:userId/changepassword", ChangePassword);
router.get("/userslist", rolesPermissions("user", "view"), FetchUsers);

export default router;
