import express from "express";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createSalesOrder,
  latestSalesOrderNo,
  fetchSalesOrders,
} from "../../../controllers/Admin/SalesOrders/sales.controller";
const router = express.Router();

router.get("/latestOrderNo", authMiddleware, latestSalesOrderNo);
router.post(
  "/create",
  authMiddleware,
  rolesPermissions("sales", "add"),
  createSalesOrder
);
router.get(
  "/fetch",
  authMiddleware,
  rolesPermissions("sales", "view"),
  fetchSalesOrders
);

export default router;
