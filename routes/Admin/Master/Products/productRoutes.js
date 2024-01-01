import express from "express";
import { MulterFunction } from "../../../../Utils/MulterFunction";
import { createProduct,
  deleteProductImage,
  getProducts,
  updateProduct,
  updateProductImage, } from "../../../../controllers/Admin/Master/Products/productsController";
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
// router.get("/getProduct",rolesPermissions("product","view"),getProducts)
router.get(
  "/getProduct",
  authMiddleware,
  rolesPermissions("product", "view"),
  getProducts
);
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
  "/deleteProductImage/:id/:imageName",
  authMiddleware,
  rolesPermissions("product", "edit"),
  deleteProductImage
);

export default router;
