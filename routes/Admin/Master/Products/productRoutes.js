import express from "express";
import { MulterFunction } from "../../../../Utils/MulterFunction";
import {
  AddProductImage,
  createProduct,
  deleteProductImage,
  getProductById,
  getProductList,
  getProducts,
  updateProduct,
  updateProductImage,
  updateProductStatus,
} from "../../../../controllers/Admin/Master/Products/productsController";
import authMiddleware from "../../../../middlewares/adminAuth";
import rolesPermissions from "../../../../middlewares/rolesPermissionAuth";

const router = express.Router();

router.post(
  "/createProduct",
  authMiddleware,
  rolesPermissions("product", "add"),
  MulterFunction("./uploads/admin/products").array("product_images", 4),
  createProduct
);

router.post(
  "/getProduct",
  authMiddleware,
  rolesPermissions("product", "view"),
  getProducts
);

router.get("/getProductList", authMiddleware, getProductList);
router.patch(
  "/updateProduct/:id",
  authMiddleware,
  rolesPermissions("product", "edit"),
  updateProduct
);
router.patch(
  "/updateProductImage/:id/:imageName",
  authMiddleware,
  rolesPermissions("product", "edit"),
  MulterFunction("./uploads/admin/products").single("product_images"),
  updateProductImage
);
router.delete(
  "/deleteProductImage/:id",
  authMiddleware,
  rolesPermissions("product", "edit"),
  deleteProductImage
);
router.post(
  "/addProductImage/:id",
  authMiddleware,
  rolesPermissions("product", "view"),
  MulterFunction("./uploads/admin/products").array("product_images"),
  AddProductImage
);

router.get(
  "/getProduct/:id",
  authMiddleware,
  rolesPermissions("product", "view"),
  getProductById
);

router.patch(
  "/updateStatus/:id",
  authMiddleware,
  rolesPermissions("product", "edit"),
  updateProductStatus
);

export default router;
