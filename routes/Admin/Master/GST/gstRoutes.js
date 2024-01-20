import express from "express";
import authMiddleware from "../../../../middlewares/adminAuth";
import rolesPermissions from "../../../../middlewares/rolesPermissionAuth";
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
router.post("/getGST", authMiddleware, rolesPermissions("gst", "view"), getGST);
router.get("/gstList", authMiddleware, getGstList);
router.patch(
  "/updateGst/:id",
  authMiddleware,
  rolesPermissions("gst", "edit"),
  updateGst
);

// router.post("/createGst", createGst);
// router.get("/getGST", getGST);
// router.get("/gstList",getGstList);
// router.patch("/updateGst/:id", updateGst);

export default router;
