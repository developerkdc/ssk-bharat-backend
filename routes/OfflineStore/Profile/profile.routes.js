import express from "express";
import { MulterFunction } from "../../../Utils/MulterFunction";
import { GetOfflinestore, UpdateOfflinestore, setPrimaryBranch } from "../../../controllers/OfflineStore/Profile/Company.controller";
import { AddContact, GetBranchList, UpdateContact, addBranch, getMyBranch, getMySingleBranch, setPrimaryContact, updateBranch, uploadDocument } from "../../../controllers/OfflineStore/Profile/Branch.controller";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";

const offlineStoreMyProfileRouter = express.Router();

// offlineStoreMyProfileRouter
//   .route("/")
//   .post(offlineStoreAuthMiddleware,MulterFunction("./uploads/admin/offlineStoreDocument/company").single("pan_image") ,offlineStore.AddCompany);

offlineStoreMyProfileRouter
    .route("/")
    .post(offlineStoreAuthMiddleware, GetOfflinestore)
    .patch(offlineStoreAuthMiddleware, MulterFunction("./uploads/admin/offlineStoreDocument/company").single("pan_image"), UpdateOfflinestore);

// offlineStoreMyProfileRouter.route("/getAllCompany")
//   .post(offlineStoreAuthMiddleware, offlineStore.GetCompany)

offlineStoreMyProfileRouter.route('/primaryBranch/:branchId')
    .patch(offlineStoreAuthMiddleware, setPrimaryBranch)

//branch

offlineStoreMyProfileRouter.route("/branch").post(offlineStoreAuthMiddleware,
    MulterFunction("./uploads/admin/offlineStoreDocument").fields([
        // { name: "pan_image", maxCount: 1 },
        { name: "gst_image", maxCount: 1 },
        { name: "passbook_image", maxCount: 1 },
    ]), addBranch);

offlineStoreMyProfileRouter
    .route("/branch")
    .get(offlineStoreAuthMiddleware, getMySingleBranch)
    .patch(offlineStoreAuthMiddleware, updateBranch);

offlineStoreMyProfileRouter
    .route("/branch/contact/:companyId/:branchId")
    .post(offlineStoreAuthMiddleware, AddContact)
    .patch(offlineStoreAuthMiddleware, UpdateContact);

offlineStoreMyProfileRouter.post("/BranchOfflineStore/all", offlineStoreAuthMiddleware, getMyBranch);

offlineStoreMyProfileRouter.patch(
    "/branch/upload/:companyId/:branchId", offlineStoreAuthMiddleware,
    MulterFunction("./uploads/admin/offlineStoreDocument").fields([
        // { name: "pan_image", maxCount: 1 },
        { name: "gst_image", maxCount: 1 },
        { name: "passbook_image", maxCount: 1 },
    ]),
    uploadDocument
);

// offlineStoreMyProfileRouter.get("/dropdown/list", offlineStoreAuthMiddleware, GetCompanyList)
offlineStoreMyProfileRouter.get("/branch/dropdown/list", GetBranchList)

offlineStoreMyProfileRouter.patch('/contact/setprimary/:branchId', offlineStoreAuthMiddleware, setPrimaryContact)

export default offlineStoreMyProfileRouter;
