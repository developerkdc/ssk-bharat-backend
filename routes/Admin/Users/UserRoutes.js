import express from "express";
import {
  AddUser,
  ChangePassword,
  EditUser,
  FetchUsers,
  UserLogs,
  UserLogsFile,
} from "../../../controllers/Admin/Users/userController";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";

const router = express.Router();

router.post(
  "/adduser",
  authMiddleware,
  rolesPermissions("user", "add"),
  AddUser
);
router.patch(
  "/edituser/:userId",
  authMiddleware,
  rolesPermissions("user", "edit"),
  EditUser
);
router.patch(
  "/:userId/changepassword",
  authMiddleware,
  rolesPermissions("user", "edit"),
  ChangePassword
);
router.get(
  "/userslist",
  authMiddleware,
  rolesPermissions("user", "view"),
  FetchUsers
);
router.get("/userslogsfile", UserLogsFile);
router.get(
  "/userslogs",
  authMiddleware,
  rolesPermissions("user", "view"),
  UserLogs
);

export default router;
