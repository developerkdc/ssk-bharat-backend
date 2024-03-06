import express from "express";
import { OfflineStoreInventoryList } from "../../../controllers/OfflineStore/Inventory/Inventorycontroller";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";

const OfflineStoreInventory = express.Router();

OfflineStoreInventory.get("/list",offlineStoreAuthMiddleware, OfflineStoreInventoryList);

export default OfflineStoreInventory;
