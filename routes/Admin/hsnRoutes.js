import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import {
  createHSN,
  getHSNCode,
  getHSNCodeList,
  updateHsnCode,
} from "../../controllers/Admin/hsnController";
import authMiddleware from "../../middlewares/adminAuth";

const router = express.Router();

router.post(
  "/createHsnCode",
  authMiddleware,
  rolesPermissions("hsnCode", "add"),
  createHSN
);
router.get(
  "/getHSNCode",
  authMiddleware,
  rolesPermissions("hsnCode", "view"),
  getHSNCode
);
router.get("/hsnCodeList", getHSNCodeList);
router.patch(
  "/updateHsnCode/:id",
  authMiddleware,
  rolesPermissions("hsnCode", "edit"),
  updateHsnCode
);

export default router;
