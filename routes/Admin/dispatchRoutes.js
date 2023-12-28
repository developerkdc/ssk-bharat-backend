import express from "express";
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../middlewares/adminAuth";
import { createDispatch, latestDispatchNo } from "../../controllers/Admin/dispatchController";

const router = express.Router();

router.get("/latestDispatchNo", authMiddleware, latestDispatchNo);
router.post(
  "/create",
  authMiddleware,
  rolesPermissions("dispatch", "add"),
  createDispatch
);
// router.get(
//   "/fetch",
//   authMiddleware,
//   rolesPermissions("sales", "view"),
//   fetchSalesOrders
// );

export default router;
