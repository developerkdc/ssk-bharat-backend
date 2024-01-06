import express from "express";
import { fetchOfflineConfirmSalesOrders } from "../../../controllers/OfflineStore/ConfirmSalesOrder/confirmSalesOrderController";

const router = express.Router();

router.get("/list", fetchOfflineConfirmSalesOrders);



export default router;
