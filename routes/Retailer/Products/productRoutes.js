import express from "express";
import { getProductList } from "../../../controllers/Admin/Master/Products/productsController";

const router = express.Router();

router.get("/getProductList", getProductList);

export default router;
