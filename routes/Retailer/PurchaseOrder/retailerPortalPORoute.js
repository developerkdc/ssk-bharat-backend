import express from "express";
import { getRetailerPoByRetailersId } from "../../../controllers/Retailer/PurchaseOrder/retailerPOController";

const router = express.Router();

router.get("/list", getRetailerPoByRetailersId);


export default router;
