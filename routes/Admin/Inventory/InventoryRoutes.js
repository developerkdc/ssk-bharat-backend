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
import { MulterFunction } from "../../../Utils/MulterFunction";

const router = express.Router();

router.post(
  "/addstock",
  authMiddleware,
  MulterFunction("./uploads/admin/Inventory").fields([
    { name: "deliveryChallanNo_image", maxCount: 1 },
    { name: "uploadInviocePDF", maxCount: 1 },
  ]),
  AddStock
);
router.post("/sampleInward", AddSampleInward);
router.get("/list", InventoryList);
router.patch("/:productId", reseverdQuantity);
router.post("/view/:id", ViewProductHistory);
router.patch("/:id", EditInventory);

export default router;
