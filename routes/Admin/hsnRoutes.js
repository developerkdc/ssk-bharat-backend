import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import {
  createHSN,
  getHSNCode,
  getHSNCodeList,
  updateHsnCode,
} from "../../controllers/Admin/hsnController";

const router = express.Router();

router.post("/createHsnCode", rolesPermissions("hsnCode", "add"), createHSN);
router.get("/getHSNCode", rolesPermissions("hsnCode", "view"), getHSNCode);
router.get("/hsnCodeList", getHSNCodeList);
router.patch(
  "/updateHsnCode/:id",
  rolesPermissions("hsnCode", "edit"),
  updateHsnCode
);

export default router;
