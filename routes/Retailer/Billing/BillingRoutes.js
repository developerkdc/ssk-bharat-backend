import express from "express";
import { Bills, createbill, latestRetailerBillNo } from "../../../controllers/Retailers/Billing/Billingcontroller";
import authMiddleware from "../../../middlewares/adminAuth";


const RetailerPRoutes = express.Router();

RetailerPRoutes.post("/createbills", authMiddleware, createbill);
RetailerPRoutes.get("/bills", Bills);
RetailerPRoutes.get("/latestbillno", latestRetailerBillNo);

export default RetailerPRoutes
