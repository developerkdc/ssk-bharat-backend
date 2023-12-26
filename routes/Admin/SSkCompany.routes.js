import express from "express";
import { MulterFunction } from "../../Utils/MulterFunction";
import CompanyMaster from "../../controllers/Admin/SupplierMaster/Company.class";
import Branches from "../../controllers/Admin/SupplierMaster/Branches.class";
const sskCompanyRouter = express.Router();

const sskCompany = new CompanyMaster("sskCompany","sskCompanies");
const branch = new Branches("sskCompany","sskCompanybranches","sskCompanies")

sskCompanyRouter.route('/')
    .get(sskCompany.GetCompany)
    .post(sskCompany.AddCompany)

sskCompanyRouter.route('/:id')
    .get(sskCompany.GetCompanyById)
    .patch(sskCompany.UpdateCompany)

sskCompanyRouter.route("/branch")
    .post(branch.addBranch)

sskCompanyRouter.route("/branch/:companyId")
    .get(branch.getBranchOfCompany)
    .patch(branch.updateBranch)

sskCompanyRouter.route('/branch/contact/:companyId/:branchId')
    .post(branch.AddContact)
    .patch(branch.UpdateContact)

sskCompanyRouter.get('/BranchSskcompany/all',branch.getAllBranchCompany);

sskCompanyRouter.patch('/branch/upload/:companyId/:branchId', MulterFunction('./uploads/admin/SskCompanyDocument').fields([{ name: 'pan_image', maxCount: 1 }, { name: 'gst_image', maxCount: 1 }, { name: 'passbook_image', maxCount: 1 }]), branch.uploadDocument('./uploads/admin/SskCompanyDocument'));

export default sskCompanyRouter;