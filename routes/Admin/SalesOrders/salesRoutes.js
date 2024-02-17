import express from "express";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createSalesOrder,
  latestSalesOrderNo,
  fetchSalesOrders,
  getSalesOrderNoList,
} from "../../../controllers/Admin/SalesOrders/sales.controller";
const router = express.Router();

router.get("/latestOrderNo", authMiddleware, latestSalesOrderNo);
router.post(
  "/create",
  authMiddleware,
  rolesPermissions("salesOrder", "add"),
  createSalesOrder
);
router.post(
  "/fetch",
  authMiddleware,
  rolesPermissions("salesOrder", "view"),
  fetchSalesOrders
);
router.get(
  "/offlineSalesOrder/dropdown/:type",
  authMiddleware,
  rolesPermissions("salesOrder", "view"),
  getSalesOrderNoList
);


export default router;
