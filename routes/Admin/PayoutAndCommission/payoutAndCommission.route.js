import express from "express";
import {
  addPayout,
  getPayoutAndCommissionTrans,
} from "../../../controllers/Admin/payoutAndCommission/payoutAndCommissionTransaction.controller";
const payoutAndCommissionRouter = express.Router();

payoutAndCommissionRouter
  .route("/:marketExecutiveId")
  .get(getPayoutAndCommissionTrans)
  .post(addPayout);

export default payoutAndCommissionRouter;
