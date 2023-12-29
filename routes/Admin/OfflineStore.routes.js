
import rolesPermissions from "../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../middlewares/adminAuth";
import { createOfflineStorePO, getStorePo, latestStorePONo } from "../../controllers/Admin/PurchaseOrders/storePOController";
import express from "express";
import { MulterFunction } from "../../Utils/MulterFunction";
import CompanyMaster from "../../controllers/Admin/SupplierMaster/Company.class";
import Branches from "../../controllers/Admin/SupplierMaster/Branches.class";

const offlineStoreRouter = express.Router();

offlineStoreRouter.post(
    "/create/PO",
    authMiddleware,
    createOfflineStorePO
    );
    offlineStoreRouter.get("/latestStorePoNo", authMiddleware, latestStorePONo);
    offlineStoreRouter.get(
        "/fetch",
        authMiddleware,
        getStorePo
        );  
    
    const offlineStore = new CompanyMaster("offlinestore","offlinestores");
    const branch = new Branches("offlinestore","offlinestorebranches","offlinestores")
    
    offlineStoreRouter.route('/')
    .get(offlineStore.GetCompany)
    .post(offlineStore.AddCompany)
    
    offlineStoreRouter.route('/:id')
    .get(offlineStore.GetCompanyById)
    .patch(offlineStore.UpdateCompany)
    
    offlineStoreRouter.route("/branch")
    .post(branch.addBranch)
    
    offlineStoreRouter.route("/branch/:companyId")
    .get(branch.getBranchOfCompany)
    .patch(branch.updateBranch)
    
offlineStoreRouter.route('/branch/contact/:companyId/:branchId')
    .post(branch.AddContact)
    .patch(branch.UpdateContact)

offlineStoreRouter.get('/BranchofflineStore/all',branch.getAllBranchCompany);

offlineStoreRouter.patch('/branch/upload/:companyId/:branchId', MulterFunction('./uploads/admin/offlineStoreDocument').fields([{ name: 'pan_image', maxCount: 1 }, { name: 'gst_image', maxCount: 1 }, { name: 'passbook_image', maxCount: 1 }]), branch.uploadDocument('./uploads/admin/offlineStoreDocument'));

export default offlineStoreRouter