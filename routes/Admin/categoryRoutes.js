import express from "express";
import { createCategory, getCategory,getCategoryList,updateCategory } from "../../controllers/Admin/categoryController";
import { MulterFunction } from "../../Utils/MulterFunction";

const router = express.Router();

router.post("/createCategory",MulterFunction("./uploads/admin/category").single("category_image"),createCategory)
router.get("/getCategory",getCategory)
router.get("/categoryList",getCategoryList)
router.patch("/updateCategory/:id",MulterFunction("./uploads/admin/category").single("category_image"),updateCategory)


export default router;