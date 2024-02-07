import express from "express";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createNewOrder,
  fetchOrders,
  latestOrderNo,
  updateOrderStatus,
} from "../../../controllers/Admin/Orders/order.controller";

const router = express.Router();

router.post(
  "/newOrder",
  authMiddleware,
  rolesPermissions("order", "add"),
  createNewOrder
);
router.get("/latestOrderNo", authMiddleware, latestOrderNo);
router.post(
  "/fetch",
  authMiddleware,
  rolesPermissions("order", "view"),
  fetchOrders
);

router.patch(
  "/update/status/:id",
  authMiddleware,
  rolesPermissions("order", "edit"),
  updateOrderStatus
);
// router.get("/supplierId/:id", authMiddleware, getPOBasedOnSupplierID);

// router.patch(
//   "/update/status/:id",
//   authMiddleware,
//   rolesPermissions("ssk_po", "edit"),
//   updatePOStatus
// );

export default router;
