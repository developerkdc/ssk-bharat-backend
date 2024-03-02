import express from "express";
import { getProductList } from "../../../controllers/Admin/Master/Products/productsController";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";

const router = express.Router();

router.get("/getProductList", retailersAuthMiddleware, getProductList);

export default router;
