import express from "express";
import { AddSupplier, GetSupplier, GetSupplierById, UpdateSupplier } from "../../../controllers/Admin/SupplierMaster/Supplier.controller";
import { AddConatct, UpdateContact, addBranch, getAllBranchSuppliers, getBranchOfSupplier, updateBranch, uploadDocument } from "../../../controllers/Admin/SupplierMaster/Branch.controller";
import { MulterFunction } from "../../../Utils/MulterFunction";
const SupplierRouter = express.Router();

SupplierRouter.route('/')
    .get(GetSupplier)
    .post(AddSupplier)

SupplierRouter.route('/:id')
    .get(GetSupplierById)
    .patch(UpdateSupplier)

SupplierRouter.route("/branch")
    .post(addBranch)

SupplierRouter.route("/branch/:supplierId")
    .get(getBranchOfSupplier)
    .patch(updateBranch)

SupplierRouter.route('/branch/contact/:supplierId/:branchId')
    .post(AddConatct)
    .patch(UpdateContact)

SupplierRouter.get('/BranchSupplier/all',getAllBranchSuppliers);

SupplierRouter.patch('/branch/upload/:supplierId/:branchId', MulterFunction('./uploads/admin/supplierDocument').fields([{ name: 'pan_image', maxCount: 1 }, { name: 'gst_image', maxCount: 1 }, { name: 'passbook_image', maxCount: 1 }]), uploadDocument);

export default SupplierRouter;