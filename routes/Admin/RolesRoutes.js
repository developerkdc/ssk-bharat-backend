import express from "express";
import { createRole, getRoles,getRolesList,updateRole} from "../../controllers/Admin/rolesController";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"
import authMiddleware from "../../middlewares/adminAuth";
const router = express.Router();

router.post("/createRole",authMiddleware,rolesPermissions("roles","add"),createRole)
router.get("/getRoles",authMiddleware,rolesPermissions("roles","view"),getRoles).get("/rolesList",getRolesList)
router.patch("/updateRole/:id",authMiddleware,rolesPermissions("roles","edit"),updateRole)


export default router;