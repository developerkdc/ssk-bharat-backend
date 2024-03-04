import express from "express";
import {
  fetchOfflineConfirmSalesOrders,
  getOrderNoFromSalesList,
} from "../../../controllers/OfflineStore/ConfirmSalesOrder/confirmSalesOrderController";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";

const router = express.Router();

router.post("/list",offlineStoreAuthMiddleware, fetchOfflineConfirmSalesOrders);
router.get("/orderNoFromSales/dropdown/:type",offlineStoreAuthMiddleware, getOrderNoFromSalesList);

export default router;
