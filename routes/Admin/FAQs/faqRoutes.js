import express from "express";
import {
  createFaq,
  deleteFaq,
  editFaq,
  getFaqs,
} from "../../../controllers/Admin/FAQs/faqController";
import authMiddleware from "../../../middlewares/adminAuth";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";

const router = express.Router();

router.post("/add", authMiddleware, rolesPermissions("faq", "add"), createFaq);
router.patch(
  "/update/:id",
  authMiddleware,
  rolesPermissions("faq", "edit"),
  editFaq
);
router.post(
  "/getFaq",
  authMiddleware,
  rolesPermissions("faq", "view"),
  getFaqs
);

router.delete(
  "/delete/:id",
  authMiddleware,
  rolesPermissions("faq", "view"),
  deleteFaq
);

export default router;
