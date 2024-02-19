import express from "express";
import { getStorePoByStoreId } from "../../../controllers/OfflineStore/PurchaseOrder/offlineStorePOController";
import { createOfflineStorePO, getStorePo, latestStorePONo } from "../../../controllers/Admin/PurchaseOrders/storePOController";

const router = express.Router();

router.post("/list", getStorePoByStoreId);
router.post("/create/PO", createOfflineStorePO);
router.get("/latestStorePoNo", latestStorePONo);
router.get("/fetch", getStorePo);


export default router;
