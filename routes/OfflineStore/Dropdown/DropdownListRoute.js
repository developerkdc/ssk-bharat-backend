import express from "express";
import CompanyMaster from "../../../controllers/Admin/Master/SupplierMaster/Company.class";
import { getProductList } from "../../../controllers/Admin/Master/Products/productsController";

const router = express.Router();
// const sskCompany = new CompanyMaster("sskCompany", "sskCompanies", "sskCompanybranches");
// router.route("/getAllCompany").get(sskCompany.GetCompanyById);
router.get("/getProductList", getProductList);
export default router;
