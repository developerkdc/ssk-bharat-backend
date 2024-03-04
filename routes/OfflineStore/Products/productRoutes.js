import express from "express";
import { getProductList } from "../../../controllers/Admin/Master/Products/productsController";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";

const router = express.Router();

router.get("/getProductList",offlineStoreAuthMiddleware, getProductList);

export default router;
