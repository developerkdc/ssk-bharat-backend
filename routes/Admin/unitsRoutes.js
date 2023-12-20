import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"
import { createUnit, getUnitList, getUnits, updateUnit } from "../../controllers/Admin/unitsController";

const router = express.Router();

router.post("/createUnit",rolesPermissions("unit","add"),createUnit)
router.get("/getUnits",rolesPermissions("unit","view"),getUnits)
router.get("/unitsList",getUnitList)
router.patch("/updateUnit/:id",rolesPermissions("unit","edit"),updateUnit)


export default router;