import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import {
  createGst,
  getGST,
  getGstList,
  updateGst,
} from "../../controllers/Admin/gstController";

const router = express.Router();

router.post("/createGst", rolesPermissions("gst", "add"), createGst);
router.get("/getGST", rolesPermissions("gst", "view"), getGST);
router.get("/gstList", getGstList);
router.patch("/updateGst/:id", rolesPermissions("gst", "edit"), updateGst);

export default router;
