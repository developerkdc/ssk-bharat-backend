import express from "express";
import rolesPermissions from "../../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../../middlewares/adminAuth";
import {
  UnitLogs,
  createUnit,
  getUnitList,
  getUnits,
  updateUnit,
} from "../../../../controllers/Admin/Master/Units/unitsController";

const router = express.Router();

router.post(
  "/createUnit",
  authMiddleware,
  rolesPermissions("unit", "add"),
  createUnit
);
router.post(
  "/getUnits",
  authMiddleware,
  rolesPermissions("unit", "view"),
  getUnits
);
router.get("/unitsList", getUnitList).get("/unitsLog", UnitLogs);
router.patch(
  "/updateUnit/:id",
  authMiddleware,
  rolesPermissions("unit", "edit"),
  updateUnit
);

export default router;
