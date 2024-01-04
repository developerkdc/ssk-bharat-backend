import express from "express";
import { UserLogs } from "../../../controllers/Admin/Users/userController";
import {
  AddSampleInward,
  AddStock,
  EditInventory,
  InventoryList,
  ViewProductHistory,
  reseverdQuantity,
} from "../../../controllers/Admin/Inventory/inventoryController";
import authMiddleware from "../../../middlewares/adminAuth";

const router = express.Router();

router.post("/addstock",authMiddleware, AddStock);
router.post("/sampleInward", AddSampleInward);
router.get("/list", InventoryList);
router.patch("/:productId", reseverdQuantity);
router.post("/view/:id", ViewProductHistory);
router.patch("/:id", EditInventory);

export default router;
