import express from "express";
import { fetchOfflineConfirmSalesOrders, getOrderNoFromSalesList } from "../../../controllers/Retailers/ConfirmSalesOrder/retailerConfirmSalesController";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";

const router = express.Router();

router.post("/list",retailersAuthMiddleware, fetchOfflineConfirmSalesOrders);
router.get("/orderNoFromSales/dropdown/:type",retailersAuthMiddleware, getOrderNoFromSalesList);



export default router;
