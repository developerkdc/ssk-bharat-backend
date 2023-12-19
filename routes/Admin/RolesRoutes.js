import express from "express";
import { createRole, getRoles,getRolesList,updateRole} from "../../controllers/Admin/rolesController";
const router = express.Router();

router.post("/createRole",createRole)
router.get("/getRoles",getRoles).get("/rolesList",getRolesList)
router.patch("/updateRole/:id",updateRole)


export default router;