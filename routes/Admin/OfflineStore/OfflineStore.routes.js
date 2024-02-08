import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createOfflineStorePO,
  getStorePo,
  latestStorePONo,
} from "../../../controllers/Admin/PurchaseOrders/storePOController";
import express from "express";
import { MulterFunction } from "../../../Utils/MulterFunction";
import CompanyMaster from "../../../controllers/Admin/Master/SupplierMaster/Company.class"
import Branches from "../../../controllers/Admin/Master/SupplierMaster/Branches.class";

const offlineStoreRouter = express.Router();

offlineStoreRouter.post("/create/PO", authMiddleware, createOfflineStorePO);
offlineStoreRouter.get("/latestStorePoNo", authMiddleware, latestStorePONo);
offlineStoreRouter.get("/fetch", authMiddleware, getStorePo);

const offlineStore = new CompanyMaster("offlinestore", "offlinestores", "offlinestorebranches");
const branch = new Branches("offlinestore", "offlinestorebranches", "offlinestores");

offlineStoreRouter
  .route("/")
  .get(authMiddleware, offlineStore.GetCompany)
  .post(authMiddleware,MulterFunction("./uploads/admin/offlineStoreDocument/company").single("pan_image") ,offlineStore.AddCompany);

offlineStoreRouter
  .route("/:id")
  .patch(authMiddleware,MulterFunction("./uploads/admin/offlineStoreDocument/company").single("pan_image") ,offlineStore.UpdateCompany);

offlineStoreRouter.route("/getAllCompany")
  .post(authMiddleware, offlineStore.GetCompany)

offlineStoreRouter.route('/primaryBranch/:companyId/:branchId')
  .patch(authMiddleware, offlineStore.setPrimaryBranch)

//branch

offlineStoreRouter.route("/branch").post(authMiddleware, 
  MulterFunction("./uploads/admin/offlineStoreDocument").fields([
    // { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),branch.addBranch);

offlineStoreRouter
  .route("/branch/:companyId")
  .get(authMiddleware, branch.getBranchOfCompany)
  .patch(authMiddleware, branch.updateBranch);

offlineStoreRouter
  .route("/branch/contact/:companyId/:branchId")
  .post(authMiddleware, branch.AddContact)
  .patch(authMiddleware, branch.UpdateContact);

offlineStoreRouter.post("/BranchOfflineStore/all", authMiddleware, branch.getAllBranchCompany);

offlineStoreRouter.patch(
  "/branch/upload/:companyId/:branchId", authMiddleware,
  MulterFunction("./uploads/admin/offlineStoreDocument").fields([
    // { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  branch.uploadDocument("./uploads/admin/offlineStoreDocument")
);

offlineStoreRouter.get("/dropdown/list", authMiddleware, offlineStore.GetCompanyList)
offlineStoreRouter.get("/branch/dropdown/list/:companyId", authMiddleware, branch.GetBranchList)

offlineStoreRouter.patch('/contact/setprimary/:companyId/:branchId', authMiddleware, branch.setPrimaryContact)

export default offlineStoreRouter;
