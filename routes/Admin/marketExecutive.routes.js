import express from "express";
import { MulterFunction } from '../../Utils/MulterFunction.js'
import { addMarketExec, addNominee, updateMarketExec, uploadMarketExecImages } from "../../controllers/Admin/MarketExecutive/MarketExecutive.controller";
const marketExecutiveRouter = express.Router();

marketExecutiveRouter.route('/')
    .post(addMarketExec)

marketExecutiveRouter.route("/:id")
    .patch(updateMarketExec)


marketExecutiveRouter.route("/uploadImage/:id")
    .patch(MulterFunction('./uploads/marketExecutive').fields([{ name: "policy_image", maxCount: 1 }, { name: "gst_image", maxCount: 1 }, { name: "pan_image", maxCount: 1 }, { name: "aadhar_image", maxCount: 1 }, { name: "passbook_image", maxCount: 1 }]), uploadMarketExecImages)

marketExecutiveRouter.route('/nominee/add/:id')
    .post(MulterFunction('./uploads/marketExecutive/nominee').fields([{ name: "pan_image", maxCount: 1 }, { name: "aadhar_image", maxCount: 1 }, { name: "passbook_image", maxCount: 1 }]),addNominee)


export default marketExecutiveRouter