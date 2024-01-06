import express from "express";
import authMiddleware from "../../../middlewares/adminAuth";
import { Bills, createbill, latestRetailerBillNo } from "../../../controllers/Retailers/Billingcontroller";


const RetailerPRoutes = express.Router();

RetailerPRoutes.post("/createbills", authMiddleware, createbill);
RetailerPRoutes.get("/bills", Bills);
RetailerPRoutes.get("/latestbillno", latestRetailerBillNo);

export default RetailerPRoutes
