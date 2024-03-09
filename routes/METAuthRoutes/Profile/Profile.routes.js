import express from "express";
import { MulterFunction } from "../../../Utils/MulterFunction.js";
import METauthMiddleware from "../../../middlewares/metAuth.js";
import { addNominee, editNominee, getSingleMarketExecutive, updateMarketExec, uploadMarketExecImages } from "../../../controllers/MET/Profile/Profile.controller.js";
const marketExecutiveProfileRouter = express.Router();

marketExecutiveProfileRouter
  .route("/")
  .get(METauthMiddleware, getSingleMarketExecutive)
  .patch(METauthMiddleware, updateMarketExec);

marketExecutiveProfileRouter.route("/uploadImage").patch(METauthMiddleware,
  MulterFunction("./uploads/admin/marketExecutive").fields([
    { name: "policy_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "pan_image", maxCount: 1 },
    { name: "aadhar_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  uploadMarketExecImages
);

marketExecutiveProfileRouter.route("/nominee/add").post(METauthMiddleware,
  MulterFunction("./uploads/admin/marketExecutive/nominee").fields([
    { name: "pan_image", maxCount: 1 },
    { name: "aadhar_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
  ]),
  addNominee
);

marketExecutiveProfileRouter.route("/nominee/update/:nomineeId").patch(METauthMiddleware,
  MulterFunction("./uploads/admin/marketExecutive/nominee").fields([
    { name: "pan_image", maxCount: 1 },
    { name: "aadhar_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
  ]),
  editNominee
);

export default marketExecutiveProfileRouter;
