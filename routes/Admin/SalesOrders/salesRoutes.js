import express from "express";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createSalesOrder,
  latestSalesOrderNo,
  fetchSalesOrders,
  getSalesOrderNoList,
  getOrderNoFromSalesList,
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
  "/offlineSalesOrder/dropdown",
  authMiddleware,
  rolesPermissions("salesOrder", "view"),
  getSalesOrderNoList
);
router.get(
  "/orderNoFromSales/dropdown/:type",
  authMiddleware,
  rolesPermissions("salesOrder", "view"),
  getOrderNoFromSalesList
);


export default router;
