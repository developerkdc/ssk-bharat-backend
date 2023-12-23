import express from "express";
import {
  AddUser,
  ChangePassword,
  EditUser,
  FetchUsers,
  UserLogs,
  UserLogsFile,

} from "../../controllers/Admin/userController";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"
import authMiddleware from "../../middlewares/adminAuth";

const router = express.Router();


router.post("/adduser",authMiddleware, AddUser);
router.patch("/edituser/:userId", authMiddleware, EditUser);
router.patch("/:userId/changepassword",authMiddleware, ChangePassword);
router.get("/userslist",authMiddleware, rolesPermissions("user", "view"), FetchUsers);
router.get("/userslogsfile", UserLogsFile);
router.get("/userslogs", UserLogs);

export default router;
