import express from "express";
import { branch } from "../../Admin/Master/Retailers/Retailer.routes";

const route = express.Router();

route.get("/branch/dropdown/list/:companyId", branch.GetBranchList);

export default route;
