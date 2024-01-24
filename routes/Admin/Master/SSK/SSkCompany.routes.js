import express from "express";
import { MulterFunction } from "../../../../Utils/MulterFunction";
import CompanyMaster from "../../../../controllers/Admin/Master/SupplierMaster/Company.class";
import Branches from "../../../../controllers/Admin/Master/SupplierMaster/Branches.class";
import authMiddleware from "../../../../middlewares/adminAuth";
const sskCompanyRouter = express.Router();

const sskCompany = new CompanyMaster("sskCompany", "sskCompanies");
const branch = new Branches("sskCompany", "sskCompanybranches", "sskcompanies");

sskCompanyRouter
  .route("/")
  .get(authMiddleware, sskCompany.GetCompany)
  .post(authMiddleware, sskCompany.AddCompany);

sskCompanyRouter
  .route("/:id")
  .get(authMiddleware, sskCompany.GetCompanyById)
  .patch(authMiddleware, sskCompany.UpdateCompany);

sskCompanyRouter.route("/branch").post(authMiddleware, branch.addBranch);

sskCompanyRouter
  .route("/branch/:companyId")
  .get(authMiddleware, branch.getBranchOfCompany)
  .patch(authMiddleware, branch.updateBranch);

sskCompanyRouter
  .route("/branch/contact/:companyId/:branchId")
  .post(authMiddleware, branch.AddContact)
  .patch(authMiddleware, branch.UpdateContact);

sskCompanyRouter.post("/BranchSskcompany/all", authMiddleware, branch.getAllBranchCompany);

sskCompanyRouter.patch(
  "/branch/upload/:companyId/:branchId", authMiddleware,
  MulterFunction("./uploads/admin/SskCompanyDocument").fields([
    { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  branch.uploadDocument("./uploads/admin/SskCompanyDocument")
);

sskCompanyRouter.get("/dropdown/list",authMiddleware,sskCompany.GetCompanyList)
sskCompanyRouter.get("/branch/dropdown/list",authMiddleware,branch.GetBranchList)

sskCompanyRouter.patch('/contact/setprimary/:companyId/:branchId',authMiddleware,branch.setPrimary)

export default sskCompanyRouter;
