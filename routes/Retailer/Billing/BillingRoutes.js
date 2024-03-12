import express from "express";
import { Bills, createbill, latestRetailerBillNo } from "../../../controllers/Retailers/Billing/Billingcontroller";
import authMiddleware from "../../../middlewares/adminAuth";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";


const RetailerBillingRoutes = express.Router();

RetailerBillingRoutes.post("/createbills", retailersAuthMiddleware, createbill);
RetailerBillingRoutes.get("/bills", Bills);
RetailerBillingRoutes.get("/latestbillno",retailersAuthMiddleware, latestRetailerBillNo);


export default RetailerBillingRoutes
