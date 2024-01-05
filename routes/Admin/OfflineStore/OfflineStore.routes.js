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

const offlineStore = new CompanyMaster("offlinestore", "offlinestores");
const branch = new Branches(
  "offlinestore",
  "offlinestorebranches",
  "offlinestores"
);

offlineStoreRouter
  .route("/")
  .get(authMiddleware,offlineStore.GetCompany)
  .post(authMiddleware,offlineStore.AddCompany);

offlineStoreRouter
  .route("/:id")
  .get(authMiddleware,offlineStore.GetCompanyById)
  .patch(authMiddleware,offlineStore.UpdateCompany);

offlineStoreRouter.route("/branch").post(authMiddleware,branch.addBranch);

offlineStoreRouter
  .route("/branch/:companyId")
  .get(authMiddleware,branch.getBranchOfCompany)
  .patch(authMiddleware,branch.updateBranch);

offlineStoreRouter
  .route("/branch/contact/:companyId/:branchId")
  .post(authMiddleware,branch.AddContact)
  .patch(authMiddleware,branch.UpdateContact);

offlineStoreRouter.get("/BranchofflineStore/all", authMiddleware,branch.getAllBranchCompany);

offlineStoreRouter.patch(
  "/branch/upload/:companyId/:branchId",authMiddleware,
  MulterFunction("./uploads/admin/offlineStoreDocument").fields([
    { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  branch.uploadDocument("./uploads/admin/offlineStoreDocument")
);

export default offlineStoreRouter;
