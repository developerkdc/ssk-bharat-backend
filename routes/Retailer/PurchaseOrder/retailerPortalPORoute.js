import express from "express";
import { getRetailerPoByRetailersId } from "../../../controllers/Retailers/PurchaseOrder/retailerPOController";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createRetailerPO,
  getRetailerPo,
  latestRetailerPONo,
} from "../../../controllers/Admin/PurchaseOrders/retailerPOController";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";

const router = express.Router();

router.post("/create/PO", retailersAuthMiddleware,createRetailerPO);
router.get("/latestRetailerPoNo", retailersAuthMiddleware,latestRetailerPONo);
router.get("/fetch",retailersAuthMiddleware, getRetailerPo);
router.post("/list",retailersAuthMiddleware, getRetailerPoByRetailersId);

export default router;
