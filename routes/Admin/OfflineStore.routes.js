import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../middlewares/adminAuth";
import { createOfflineStorePO, getStorePo, latestStorePONo } from "../../controllers/Admin/PurchaseOrders/storePOController";


const router = express.Router();

router.post(
  "/create/PO",
  authMiddleware,
  rolesPermissions("store_po", "add"),
  createOfflineStorePO
);
router.get("/latestStorePoNo", authMiddleware, latestStorePONo);
router.get(
  "/fetch",
  authMiddleware,
  rolesPermissions("store_po", "view"),
  getStorePo
);
// router.get("/supplierId/:id", authMiddleware, getPOBasedOnSupplierID);

// router.patch(
//   "/update/status/:id",
//   authMiddleware,
//   rolesPermissions("ssk_po", "edit"),
//   updatePOStatus
// );

export default router;
