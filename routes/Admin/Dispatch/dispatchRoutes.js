import express from "express";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createDispatch,
  delivered,
  fetchDispatchBasedonDeliveryStatus,
  latestDispatchNo,
  outForDelivery,
} from "../../../controllers/Admin/Dispatch/dispatchController";

const router = express.Router();

router.get("/latestDispatchNo", authMiddleware, latestDispatchNo);
router.post(
  "/create",
  authMiddleware,
  rolesPermissions("dispatch", "add"),
  createDispatch
);
router.post(
  "/fetch",
  authMiddleware,
  rolesPermissions("dispatch", "view"),
  fetchDispatchBasedonDeliveryStatus
);
router.patch(
  "/outForDelivery/:id",
  authMiddleware,
  rolesPermissions("dispatch", "edit"),
  outForDelivery
);
router.patch(
  "/delivered/:id",
  authMiddleware,
  rolesPermissions("dispatch", "edit"),
  delivered
);

export default router;
