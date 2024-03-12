import express from "express";
import { GetRetailer, UpdateRetailer, setPrimaryBranch } from "../../../controllers/Retailers/Profile/Company.controller";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";
import { AddContact, GetBranchList, UpdateContact, addBranch, getMyBranch, getMySingleBranch, setPrimaryContact, updateBranch, uploadDocument } from "../../../controllers/Retailers/Profile/Branch.controller";
import { MulterFunction } from "../../../Utils/MulterFunction";
const retailerMyProfileRouter = express.Router();

// retailerMyProfileRouter.route("/")
//   .post(retailersAuthMiddleware,MulterFunction("./uploads/admin/retailerDocument/company").single("pan_image") ,retailer.AddCompany);

// retailerMyProfileRouter.route("/getAllCompany")

retailerMyProfileRouter
    .route("/")
    .post(retailersAuthMiddleware, GetRetailer)
    .patch(retailersAuthMiddleware, MulterFunction("./uploads/admin/retailerDocument/company").single("pan_image"), UpdateRetailer);

retailerMyProfileRouter.route('/primaryBranch/:branchId')
    .patch(retailersAuthMiddleware, setPrimaryBranch)

//branch
retailerMyProfileRouter.route("/branch").post(
    retailersAuthMiddleware,
    MulterFunction("./uploads/admin/retailerDocument").fields([
        // { name: "pan_image", maxCount: 1 },
        { name: "gst_image", maxCount: 1 },
        { name: "passbook_image", maxCount: 1 },
    ]), addBranch);

retailerMyProfileRouter
    .route("/branch")
    .get(retailersAuthMiddleware, getMySingleBranch)
    .patch(retailersAuthMiddleware, updateBranch);

retailerMyProfileRouter
    .route("/branch/contact/:branchId")
    .post(retailersAuthMiddleware, AddContact)
    .patch(retailersAuthMiddleware, UpdateContact);

retailerMyProfileRouter.post("/BranchRetailer/all", retailersAuthMiddleware, getMyBranch);

retailerMyProfileRouter.patch(
    "/branch/upload/:branchId", retailersAuthMiddleware,
    MulterFunction("./uploads/admin/retailerDocument").fields([
        // { name: "pan_image", maxCount: 1 },
        { name: "gst_image", maxCount: 1 },
        { name: "passbook_image", maxCount: 1 },
    ]),
    uploadDocument
);

// retailerMyProfileRouter.get("/dropdown/list", retailersAuthMiddleware, GetCompanyList)
retailerMyProfileRouter.get("/branch/dropdown/list", retailersAuthMiddleware, GetBranchList)

retailerMyProfileRouter.patch('/contact/setprimary/:branchId', retailersAuthMiddleware, setPrimaryContact)

export default retailerMyProfileRouter;
