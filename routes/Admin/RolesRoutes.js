import express from "express";
import { createRole, getRoles,getRolesList,updateRole} from "../../controllers/Admin/rolesController";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"
const router = express.Router();

router.post("/createRole",rolesPermissions("roles","add"),createRole)
router.get("/getRoles",rolesPermissions("roles","view"),getRoles).get("/rolesList",getRolesList)
router.patch("/updateRole/:id",rolesPermissions("roles","edit"),updateRole)


export default router;