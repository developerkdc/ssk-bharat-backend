import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../middlewares/adminAuth";
import { createNewOrder, fetchOrders, latestOrderNo } from "../../controllers/Admin/order.controller";


const router = express.Router();

router.post(
  "/newOrder",
  authMiddleware,
  rolesPermissions("new_order", "add"),
  createNewOrder
);
router.get("/latestOrderNo", authMiddleware, latestOrderNo);
router.get(
  "/fetch",
  authMiddleware,
  rolesPermissions("new_order", "view"),
  fetchOrders
);
// router.get("/supplierId/:id", authMiddleware, getPOBasedOnSupplierID);

// router.patch(
//   "/update/status/:id",
//   authMiddleware,
//   rolesPermissions("ssk_po", "edit"),
//   updatePOStatus
// );

export default router;
