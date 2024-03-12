import express from "express";
import { Bills, createbill, latestRetailerBillNo } from "../../../controllers/Retailers/Billing/Billingcontroller";
import authMiddleware from "../../../middlewares/adminAuth";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";


const RetailerPRoutes = express.Router();

RetailerPRoutes.post("/createbills", retailersAuthMiddleware, createbill);
RetailerPRoutes.get("/bills", Bills);
RetailerPRoutes.get("/latestbillno", latestRetailerBillNo);


export default RetailerPRoutes
