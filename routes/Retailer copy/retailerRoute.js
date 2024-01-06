import express from "express";
import { getRetailerPoByRetailersId } from "../../controllers/Retailers/retailerController";

const router = express.Router();

router.get("/po/:id", getRetailerPoByRetailersId);


export default router;
