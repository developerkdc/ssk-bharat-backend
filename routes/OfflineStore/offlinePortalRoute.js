import express from "express";
import { getStorePoByStoreId } from "../../controllers/OfflineStore/offlineStoreController";

const router = express.Router();

router.get("/po", getStorePoByStoreId);


export default router;
