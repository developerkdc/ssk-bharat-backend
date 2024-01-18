import express from "express";
import {
  createCategory,
  getCategory,
  getCategoryList,
  updateCategory,
} from "../../../../controllers/Admin/Master/Category/categoryController";
import { MulterFunction } from "../../../../Utils/MulterFunction";
import rolesPermissions from "../../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../../middlewares/adminAuth";


const router = express.Router();

router.post(
  "/createCategory",
  authMiddleware,
  rolesPermissions("category", "add"),
  MulterFunction("./uploads/admin/category").single("category_image"),
  createCategory
);
router.post(
  "/getCategory",
  authMiddleware,
  rolesPermissions("category", "view"),
  getCategory
);
router.get("/categoryList", authMiddleware, getCategoryList);
router.patch(
  "/updateCategory/:id",
  authMiddleware,
  rolesPermissions("category", "edit"),
  MulterFunction("./uploads/admin/category").single("category_image"),
  updateCategory
);

export default router;
