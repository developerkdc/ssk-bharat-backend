import express from "express";
import { MulterFunction } from "../../../../Utils/MulterFunction";
import authMiddleware from "../../../../middlewares/adminAuth"
import CompanyMaster from "../../../../controllers/Admin/Master/SupplierMaster/Company.class";
import Branches from "../../../../controllers/Admin/Master/SupplierMaster/Branches.class";
const SupplierRouter = express.Router();

const supplier = new CompanyMaster("supplier", "suppliers");
const branch = new Branches("supplier", "supplierbranches", "suppliers");

SupplierRouter.route("/")
  .get(authMiddleware,supplier.GetCompany)
  .post(authMiddleware,supplier.AddCompany);

SupplierRouter.route("/:id")
  .get(authMiddleware,supplier.GetCompanyById)
  .patch(authMiddleware,supplier.UpdateCompany);

SupplierRouter.route("/branch").post(authMiddleware,branch.addBranch);

SupplierRouter.route("/branch/:companyId")
  .get(authMiddleware,branch.getBranchOfCompany)
  .patch(authMiddleware,branch.updateBranch);

SupplierRouter.route("/branch/contact/:companyId/:branchId")
  .post(authMiddleware,branch.AddContact)
  .patch(authMiddleware,branch.UpdateContact);

SupplierRouter.post("/BranchSupplier/all", authMiddleware,branch.getAllBranchCompany);

SupplierRouter.patch(
  "/branch/upload/:companyId/:branchId",authMiddleware,
  MulterFunction("./uploads/admin/supplierDocument").fields([
    { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  branch.uploadDocument("./uploads/admin/supplierDocument")
);

SupplierRouter.get("/dropdown/list",authMiddleware,supplier.GetCompanyList)
SupplierRouter.get("/branch/dropdown/list",authMiddleware,branch.GetBranchList)


export default SupplierRouter;
