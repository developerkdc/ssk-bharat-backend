import express from "express";
import authMiddleware from "../../../../middlewares/adminAuth";
import rolesPermissions from "../../../../middlewares/rolesPermissionAuth";
import {
  createHSN,
  getHSNCode,
  getHSNCodeList,
  updateHsnCode,
} from "../../../../controllers/Admin/Master/HSN/hsnController";

const router = express.Router();

router.post(
  "/createHsnCode",
  authMiddleware,
  rolesPermissions("hsn_code", "add"),
  createHSN
);
router.get(
  "/getHSNCode",
  authMiddleware,
  rolesPermissions("hsn_code", "view"),
  getHSNCode
);
router.get("/hsnCodeList", getHSNCodeList);
router.patch(
  "/updateHsnCode/:id",
  authMiddleware,
  rolesPermissions("hsn_code", "edit"),
  updateHsnCode
);

export default router;
