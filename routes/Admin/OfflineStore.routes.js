import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../middlewares/adminAuth";
import { createStorePO } from "../../controllers/Admin/PurchaseOrders/storePOController";


const router = express.Router();

router.post(
  "/create/PO",
  authMiddleware,
  rolesPermissions("store_po", "add"),
  createStorePO
);
// router.get("/latestPo", authMiddleware, latestSSKPONo);
// router.get(
//   "/fetch",
//   authMiddleware,
//   rolesPermissions("ssk_po", "view"),
//   getSSKPo
// );
// router.get("/supplierId/:id", authMiddleware, getPOBasedOnSupplierID);

// router.patch(
//   "/update/status/:id",
//   authMiddleware,
//   rolesPermissions("ssk_po", "edit"),
//   updatePOStatus
// );

export default router;
