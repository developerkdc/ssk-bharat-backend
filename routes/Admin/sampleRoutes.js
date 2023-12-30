import express from "express";
import {
  getChallanDetails,
  getItemdetails,
  outwardSample,
  sampleList,
} from "../../controllers/Admin/sampleController";

const router = express.Router();

router.post("/outward", outwardSample);
router.get("/list", sampleList);
router.get("/:itemid", getItemdetails);
router.get("/:challanno", getChallanDetails);


export default router;
