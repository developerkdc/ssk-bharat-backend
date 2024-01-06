import express from "express";
import { getStorePoByStoreId } from "../../../controllers/OfflineStore/PurchaseOrder/offlineStorePOController";

const router = express.Router();

router.get("/list", getStorePoByStoreId);



export default router;
