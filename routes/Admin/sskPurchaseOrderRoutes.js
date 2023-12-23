import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../middlewares/adminAuth";
import { createSSKPO, getSSKPo, latestSSKPONo } from "../../controllers/Admin/sskPOController";

const router = express.Router();

router.post("/createSSK/Po",authMiddleware, rolesPermissions("ssk_po", "add"), createSSKPO);
router.get("/latestPo",authMiddleware, latestSSKPONo);
router.get("/getSSK/PO", authMiddleware,rolesPermissions("ssk_po", "view"), getSSKPo);
// router.get("/gstSSKPOList", authMiddleware,getGstList);
// router.patch("/updateSSK/PO/:id",authMiddleware, rolesPermissions("ssk_po", "edit"), updateGst);

export default router;
