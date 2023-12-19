import express from "express";
import { AddSupplier, GetSupplier, GetSupplierById, UpdateSupplier } from "../../../controllers/Admin/SupplierMaster/Supplier.controller";
import { AddConatct, UpdateContact, addBranch, getBranchOfSupplier, updateBranch } from "../../../controllers/Admin/SupplierMaster/Branch.controller";
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

export default SupplierRouter;