import express from "express";
import {RetailerInventoryList, ViewProductHistory } from "../.././../controllers/Retailers/Inventory/Inventorycontroller";
import retailerAuthMiddleware from "../../../middlewares/retailerAuth";

const RetailerInventory = express.Router();

RetailerInventory.get("/list", retailerAuthMiddleware, RetailerInventoryList);
RetailerInventory.post("/view/:id", retailerAuthMiddleware, ViewProductHistory);

export default RetailerInventory;
