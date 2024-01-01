import express from "express";
import { AddSupplier, GetSupplier, GetSupplierById, UpdateSupplier } from "../../controllers/Admin/SupplierMaster/Supplier.controller";
import { AddConatct, UpdateContact, addBranch, getAllBranchSuppliers, getBranchOfSupplier, updateBranch, uploadDocument } from "../../controllers/Admin/SupplierMaster/Branch.controller";
import { MulterFunction } from "../../Utils/MulterFunction";
import CompanyMaster from "../../controllers/Admin/SupplierMaster/Company.class";
import Branches from "../../controllers/Admin/SupplierMaster/Branches.class";
const SupplierRouter = express.Router();

const supplier = new CompanyMaster("supplier","suppliers");
const branch = new Branches("supplier","supplierbranches","suppliers")

SupplierRouter.route('/')
    .get(supplier.GetCompany)
    .post(supplier.AddCompany)

SupplierRouter.route('/:id')
    .get(supplier.GetCompanyById)
    .patch(supplier.UpdateCompany)

SupplierRouter.route("/branch")
    .post(branch.addBranch)

SupplierRouter.route("/branch/:companyId")
    .get(branch.getBranchOfCompany)
    .patch(branch.updateBranch)

SupplierRouter.route('/branch/contact/:companyId/:branchId')
    .post(branch.AddContact)
    .patch(branch.UpdateContact)

SupplierRouter.get('/BranchSupplier/all',branch.getAllBranchCompany);

SupplierRouter.patch('/branch/upload/:companyId/:branchId',MulterFunction('./uploads/admin/supplierDocument').fields([{ name: 'pan_image', maxCount: 1 }, { name: 'gst_image', maxCount: 1 }, { name: 'passbook_image', maxCount: 1 }]), branch.uploadDocument('./uploads/admin/supplierDocument'));

export default SupplierRouter;