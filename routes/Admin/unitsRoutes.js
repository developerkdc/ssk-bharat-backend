import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"
import { createUnit, getUnitList, getUnits, updateUnit } from "../../controllers/Admin/unitsController";
import authMiddleware from "../../middlewares/adminAuth";

const router = express.Router();

router.post("/createUnit",authMiddleware,rolesPermissions("unit","add"),createUnit)
router.get("/getUnits",authMiddleware,rolesPermissions("unit","view"),getUnits)
router.get("/unitsList",getUnitList)
router.patch("/updateUnit/:id",authMiddleware,rolesPermissions("unit","edit"),updateUnit)


export default router;