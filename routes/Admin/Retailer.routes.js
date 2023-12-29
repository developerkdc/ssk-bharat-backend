import express from "express";
import { MulterFunction } from "../../Utils/MulterFunction";
import CompanyMaster from "../../controllers/Admin/SupplierMaster/Company.class";
import Branches from "../../controllers/Admin/SupplierMaster/Branches.class";
const retailerRouter = express.Router();

const retailer = new CompanyMaster("retailer", "retailers");
const branch = new Branches("retailer", "retailerbranches", "retailers");

// retailerRouter.post(
//   "/create/PO",
//   authMiddleware,
//   rolesPermissions("retailer_po", "add"),
//   createOfflineStorePO
// );

// retailerRouter.get("/latestRetailerPoNo", authMiddleware, latestStorePONo);
// retailerRouter.get(
//   "/fetch",
//   authMiddleware,
//   rolesPermissions("retailer_po", "view"),
//   getStorePo
// );

retailerRouter.route("/").get(retailer.GetCompany).post(retailer.AddCompany);

retailerRouter
  .route("/:id")
  .get(retailer.GetCompanyById)
  .patch(retailer.UpdateCompany);

retailerRouter.route("/branch").post(branch.addBranch);

retailerRouter
  .route("/branch/:companyId")
  .get(branch.getBranchOfCompany)
  .patch(branch.updateBranch);

retailerRouter
  .route("/branch/contact/:companyId/:branchId")
  .post(branch.AddContact)
  .patch(branch.UpdateContact);

retailerRouter.get("/Branchretailer/all", branch.getAllBranchCompany);

retailerRouter.patch(
  "/branch/upload/:companyId/:branchId",
  MulterFunction("./uploads/admin/retailerDocument").fields([
    { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  branch.uploadDocument("./uploads/admin/retailerDocument")
);

export default retailerRouter;
