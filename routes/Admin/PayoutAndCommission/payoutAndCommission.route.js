import express from "express";
import {
  addPayout,
  getPayoutAndCommissionTrans,
} from "../../../controllers/Admin/payoutAndCommission/payoutAndCommissionTransaction.controller";
import authMiddleware from "../../../middlewares/adminAuth";
const payoutAndCommissionRouter = express.Router();

payoutAndCommissionRouter.route("/:marketExecutiveId")
  .post(authMiddleware, addPayout);

payoutAndCommissionRouter.route("/transactionHistory/:marketExecutiveId")
  .post(authMiddleware,getPayoutAndCommissionTrans);

export default payoutAndCommissionRouter;
