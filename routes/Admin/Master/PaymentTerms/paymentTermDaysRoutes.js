import express from "express";
import rolesPermissions from "../../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../../middlewares/adminAuth";
import {
  createTermDays,
  getPaymentTermDays,
  getPaymentTermList,
  updatePaymentTerm,
} from "../../../../controllers/Admin/Master/PaymentTerms/paymentTermController";


const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  rolesPermissions("term_days", "add"),
  createTermDays
);
router.get(
  "/get",
  authMiddleware,
  rolesPermissions("term_days", "view"),
  getPaymentTermDays
);
router.get("/list", authMiddleware, getPaymentTermList);
router.patch(
  "/update/:id",
  authMiddleware,
  rolesPermissions("term_days", "edit"),
  updatePaymentTerm
);

export default router;
