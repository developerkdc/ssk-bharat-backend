import express from "express";
import { getRetailerPoByRetailersId } from "../../controllers/Retailer/retailerController";

const router = express.Router();

router.get("/po", getRetailerPoByRetailersId);


export default router;
