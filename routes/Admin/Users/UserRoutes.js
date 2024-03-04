import express from "express";
import {
  AddUser,
  ChangePassword,
  EditUser,
  FetchUsers,
  UserLogs,
  UserLogsFile,
  generatePassword,
  getAllActiveUsers,
  getUserList,
} from "../../../controllers/Admin/Users/userController";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import { MulterFunction } from "../../../Utils/MulterFunction";

const router = express.Router();

router.post(
  "/adduser",
  authMiddleware,
  MulterFunction("./uploads/admin/userDocument").fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "pan_image", maxCount: 1 },
    { name: "aadhar_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  rolesPermissions("user", "add"),
  AddUser
);

router.patch(
  "/edituser/:userId",
  authMiddleware,
  MulterFunction("./uploads/admin/userDocument").fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "pan_image", maxCount: 1 },
    { name: "aadhar_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  rolesPermissions("user", "edit"),
  EditUser
);
router.patch(
  "/:userId/changepassword",
  authMiddleware,
  rolesPermissions("user", "edit"),
  ChangePassword
);
router.post(
  "/userslist",
  authMiddleware,
  rolesPermissions("user", "view"),
  FetchUsers
);
router.post(
  "/active-users",
  authMiddleware,
  rolesPermissions("user", "view"),
  getAllActiveUsers
);
router.get("/userslogsfile", UserLogsFile);

router.get(
  "/userslogs",
  authMiddleware,
  rolesPermissions("user", "view"),
  UserLogs
);
router.get("/list", authMiddleware, getUserList);
router.get("/generate-password", generatePassword);

export default router;
