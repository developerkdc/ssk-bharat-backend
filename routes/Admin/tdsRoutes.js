import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../middlewares/adminAuth";
import { createTds, getTDS, getTDSList, updateTds } from "../../controllers/Admin/tdsController";

const router = express.Router();

router.post("/createTds",authMiddleware, rolesPermissions("tds", "add"), createTds);
router.get("/getTds", authMiddleware,rolesPermissions("tds", "view"), getTDS);
router.get("/tdsList", authMiddleware,getTDSList);
router.patch("/updateTds/:id",authMiddleware, rolesPermissions("tds", "edit"), updateTds);

export default router;
