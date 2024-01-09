import express from "express";
import {RetailerInventoryList } from "../.././../controllers/Retailers/Inventory/Inventorycontroller";
import authMiddleware from "../../../middlewares/adminAuth";

const RetailerInventory = express.Router();

RetailerInventory.get("/list", RetailerInventoryList);

export default RetailerInventory;
