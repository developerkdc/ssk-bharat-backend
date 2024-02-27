import express from "express";
import { fetchOfflineConfirmSalesOrders, getOrderNoFromSalesList } from "../../../controllers/Retailers/ConfirmSalesOrder/retailerConfirmSalesController";

const router = express.Router();

router.post("/list", fetchOfflineConfirmSalesOrders);
router.get("/orderNoFromSales/dropdown/:type", getOrderNoFromSalesList);



export default router;
