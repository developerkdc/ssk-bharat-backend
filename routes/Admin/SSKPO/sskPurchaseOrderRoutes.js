import express from "express";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createSSKPO,
  getPOBasedOnSupplierID,
  getSSKPo,
  latestSSKPONo,
  updatePOStatus,
} from "../../../controllers/Admin/PurchaseOrders/sskPOController";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  rolesPermissions("ssk_po", "add"),
  createSSKPO
);
router.get("/latestPo", authMiddleware, latestSSKPONo);
router.get(
  "/fetch",
  authMiddleware,
  rolesPermissions("ssk_po", "view"),
  getSSKPo
);
router.get("/supplierId/:id", authMiddleware, getPOBasedOnSupplierID);

router.patch(
  "/update/status/:id",
  authMiddleware,
  rolesPermissions("ssk_po", "edit"),
  updatePOStatus
);
// router.patch("/updateSSK/PO/:id",authMiddleware, rolesPermissions("ssk_po", "edit"), updateGst);

export default router;
