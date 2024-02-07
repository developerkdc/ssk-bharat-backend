import express from "express";
import { MulterFunction } from "../../../Utils/MulterFunction.js";
import {
  addMarketExec,
  addNominee,
  editNominee,
  getMarketExecutive,
  getMarketExecutiveById,
  getMarketExecutiveList,
  updateMarketExec,
  uploadMarketExecImages,
} from "../../../controllers/Admin/MET/MarketExecutive.controller.js";
import authMiddleware from "../../../middlewares/adminAuth.js";
const marketExecutiveRouter = express.Router();

marketExecutiveRouter.route("/")
  .post(authMiddleware,
    MulterFunction("./uploads/admin/marketExecutive").fields([
      { name: "policy_image", maxCount: 1 },
      { name: "gst_image", maxCount: 1 },
      { name: "pan_image", maxCount: 1 },
      { name: "aadhar_image", maxCount: 1 },
      { name: "passbook_image", maxCount: 1 },
    ]), addMarketExec);

marketExecutiveRouter
  .route("/:id")
  .get(authMiddleware, getMarketExecutiveById)
  .patch(authMiddleware, updateMarketExec);

marketExecutiveRouter.route("/uploadImage/:id").patch(authMiddleware,
  MulterFunction("./uploads/admin/marketExecutive").fields([
    { name: "policy_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
    { name: "pan_image", maxCount: 1 },
    { name: "aadhar_image", maxCount: 1 },
    { name: "passbook_image", maxCount: 1 },
  ]),
  uploadMarketExecImages
);

marketExecutiveRouter.post('/getAllMet',getMarketExecutive)
marketExecutiveRouter.get("/dropdown/list", getMarketExecutiveList)

marketExecutiveRouter.route("/nominee/add/:id").post(authMiddleware,
  MulterFunction("./uploads/admin/marketExecutive/nominee").fields([
    { name: "pan_image", maxCount: 1 },
    { name: "aadhar_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
  ]),
  addNominee
);

marketExecutiveRouter.route("/nominee/update/:id/:nomineeId").patch(authMiddleware,
  MulterFunction("./uploads/admin/marketExecutive/nominee").fields([
    { name: "pan_image", maxCount: 1 },
    { name: "aadhar_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 },
  ]),
  editNominee
);

export default marketExecutiveRouter;
