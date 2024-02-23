import express from "express";
import {
  fetchOfflineConfirmSalesOrders,
  getOrderNoFromSalesList,
} from "../../../controllers/OfflineStore/ConfirmSalesOrder/confirmSalesOrderController";

const router = express.Router();

router.post("/list", fetchOfflineConfirmSalesOrders);
router.get("/orderNoFromSales/dropdown/:type", getOrderNoFromSalesList);

export default router;
