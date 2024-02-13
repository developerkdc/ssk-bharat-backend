import express from "express";
import { MulterFunction } from "../../../../Utils/MulterFunction";
import CompanyMaster from "../../../../controllers/Admin/Master/SupplierMaster/Company.class";
import Branches from "../../../../controllers/Admin/Master/SupplierMaster/Branches.class";
import authMiddleware from "../../../../middlewares/adminAuth";
import rolesPermissions from "../../../../middlewares/rolesPermissionAuth";
import {
  createRetailerPO,
  getRetailerPo,
  latestRetailerPONo,
} from "../../../../controllers/Admin/PurchaseOrders/retailerPOController";

const retailerRouter = express.Router();

const retailer = new CompanyMaster("retailer", "retailers", "retailerbranches");
const branch = new Branches("retailer", "retailerbranches", "retailers");

retailerRouter.post("/create/PO", authMiddleware, createRetailerPO);

retailerRouter.get("/latestRetailerPoNo", authMiddleware, latestRetailerPONo);
retailerRouter.get("/fetch", authMiddleware, getRetailerPo);

retailerRouter.route("/")
  .post(authMiddleware,MulterFunction("./uploads/admin/retailerDocument/company").single("pan_image") ,retailer.AddCompany);

retailerRouter.route("/getAllCompany")
  .post(authMiddleware, retailer.GetCompany)

retailerRouter
  .route("/:id")
  .get(authMiddleware, retailer.GetCompanyById)
  .patch(authMiddleware,MulterFunction("./uploads/admin/retailerDocument/company").single("pan_image") ,retailer.UpdateCompany);

retailerRouter.route('/primaryBranch/:companyId/:branchId')
  .patch(authMiddleware, retailer.setPrimaryBranch)

//branch
retailerRouter.route("/branch").post(authMiddleware,
  MulterFunction("./uploads/admin/retailerDocument").fields([
    // { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]), branch.addBranch);

retailerRouter
  .route("/branch/:companyId")
  .get(authMiddleware, branch.getBranchOfCompany)
  .patch(authMiddleware, branch.updateBranch);

retailerRouter
  .route("/branch/contact/:companyId/:branchId")
  .post(authMiddleware, branch.AddContact)
  .patch(authMiddleware, branch.UpdateContact);

retailerRouter.post("/BranchRetailer/all", authMiddleware, branch.getAllBranchCompany);

retailerRouter.patch(
  "/branch/upload/:companyId/:branchId", authMiddleware,
  MulterFunction("./uploads/admin/retailerDocument").fields([
    // { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  branch.uploadDocument("./uploads/admin/retailerDocument")
);

retailerRouter.get("/dropdown/list", authMiddleware, retailer.GetCompanyList)
retailerRouter.get("/branch/dropdown/list/:companyId", authMiddleware, branch.GetBranchList)

retailerRouter.patch('/contact/setprimary/:companyId/:branchId', authMiddleware, branch.setPrimaryContact)

export default retailerRouter;
