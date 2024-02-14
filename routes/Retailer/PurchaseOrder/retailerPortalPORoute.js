import express from "express";
import { getRetailerPoByRetailersId } from "../../../controllers/Retailers/PurchaseOrder/retailerPOController";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createRetailerPO,
  getRetailerPo,
  latestRetailerPONo,
} from "../../../controllers/Admin/PurchaseOrders/retailerPOController";

const router = express.Router();

router.post("/create/PO", createRetailerPO);
router.get("/latestRetailerPoNo", latestRetailerPONo);
router.get("/fetch", getRetailerPo);
router.post("/list", getRetailerPoByRetailersId);

export default router;
