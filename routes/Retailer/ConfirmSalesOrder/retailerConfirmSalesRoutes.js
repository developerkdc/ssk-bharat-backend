import express from "express";
import { fetchOfflineConfirmSalesOrders } from "../../../controllers/Retailer/ConfirmSalesOrder/retailerConfirmSalesController";

const router = express.Router();

router.get("/list", fetchOfflineConfirmSalesOrders);



export default router;
