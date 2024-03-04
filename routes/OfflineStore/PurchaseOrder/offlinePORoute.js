import express from "express";
import { getStorePoByStoreId } from "../../../controllers/OfflineStore/PurchaseOrder/offlineStorePOController";
import { createOfflineStorePO, getStorePo, latestStorePONo } from "../../../controllers/Admin/PurchaseOrders/storePOController";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";

const router = express.Router();

router.post("/list",offlineStoreAuthMiddleware, getStorePoByStoreId);
router.post("/create/PO", offlineStoreAuthMiddleware,createOfflineStorePO);
router.get("/latestStorePoNo",offlineStoreAuthMiddleware, latestStorePONo);
router.get("/fetch",offlineStoreAuthMiddleware, getStorePo);


export default router;
