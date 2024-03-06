import express from "express";
import {RetailerInventoryList } from "../.././../controllers/Retailers/Inventory/Inventorycontroller";
import retailerAuthMiddleware from "../../../middlewares/retailerAuth";

const RetailerInventory = express.Router();

RetailerInventory.get("/list", retailerAuthMiddleware, RetailerInventoryList);

export default RetailerInventory;
