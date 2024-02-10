import express from "express";
import CompanyMaster from "../../../controllers/Admin/Master/SupplierMaster/Company.class";
import Branches from "../../../controllers/Admin/Master/SupplierMaster/Branches.class";

const router = express.Router();
const offlineStore = new CompanyMaster("offlinestore", "offlinestores", "offlinestorebranches");
const branch = new Branches("offlinestore", "offlinestorebranches", "offlinestores");
router.get("/branch/dropdown/list/:companyId", branch.GetBranchList)


export default router;
