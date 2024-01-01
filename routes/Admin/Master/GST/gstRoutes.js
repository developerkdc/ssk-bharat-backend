import express from "express";
import rolesPermissions from "../../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../../middlewares/adminAuth";
import {
  createGst,
  getGST,
  getGstList,
  updateGst,
} from "../../../../controllers/Admin/Master/GST/gstController";

const router = express.Router();

router.post(
  "/createGst",
  authMiddleware,
  rolesPermissions("gst", "add"),
  createGst
);
router.get("/getGST", authMiddleware, rolesPermissions("gst", "view"), getGST);
router.get("/gstList", authMiddleware, getGstList);
router.patch(
  "/updateGst/:id",
  authMiddleware,
  rolesPermissions("gst", "edit"),
  updateGst
);

export default router;
