import express from "express";
import { createRole, getRoles,getRolesList } from "../../controllers/Admin/rolesController";
const router = express.Router();

router.post("/createRole",createRole)
router.get("/getRoles",getRoles).get("/rolesList",getRolesList)

export default router;