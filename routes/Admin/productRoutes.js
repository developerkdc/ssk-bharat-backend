import express from "express";
import { MulterFunction } from "../../Utils/MulterFunction";
import rolesPermissions from "../../middlewares/rolesPermissionAuth"
import { createProduct, getProducts, updateProduct } from "../../controllers/Admin/productsController";

const router = express.Router();

router.post("/createProduct",rolesPermissions("product","add"),MulterFunction("./uploads/admin/products").array("product_images"),createProduct)
router.get("/getProduct",rolesPermissions("product","view"),getProducts)
// router.get("/categoryList",getCategoryList)
router.patch("/updateProduct/:id",rolesPermissions("product","edit"),updateProduct)


export default router;