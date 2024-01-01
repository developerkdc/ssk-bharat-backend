import express from "express";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createRefund,
  getRefundHist,
  getRefundBySalesId,
} from "../../../controllers/Admin/SalesOrders/refundController";
const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  rolesPermissions("refund", "add"),
  createRefund
);
router
  .get(
    "/fetch",
    authMiddleware,
    rolesPermissions("refund", "view"),
    getRefundHist
  )
  .get(
    "/fetch/:salesid",
    authMiddleware,
    rolesPermissions("refund", "view"),
    getRefundBySalesId
  );

export default router;
