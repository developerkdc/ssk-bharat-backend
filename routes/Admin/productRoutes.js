import express from "express";
import { MulterFunction } from "../../Utils/MulterFunction";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"
import { createProduct, deleteProductImage, getProducts, updateProduct, updateProductImage } from "../../controllers/Admin/productsController";

const router = express.Router();

router.post("/createProduct",rolesPermissions("product","add"),MulterFunction("./uploads/admin/products").array("product_images",4),createProduct)
// router.get("/getProduct",rolesPermissions("product","view"),getProducts)
router.get("/getProduct",getProducts)

// router.get("/categoryList",getCategoryList)
router.patch("/updateProduct/:id",updateProduct)
router.patch("/updateProductImage/:id/:imageName",MulterFunction("./uploads/admin/products").single("product_images"),updateProductImage)
router.delete("/deleteProductImage/:id/:imageName",deleteProductImage)




export default router;