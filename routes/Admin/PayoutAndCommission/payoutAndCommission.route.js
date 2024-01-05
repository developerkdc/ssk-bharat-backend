import express from "express";
import {
  addPayout,
  getPayoutAndCommissionTrans,
} from "../../../controllers/Admin/payoutAndCommission/payoutAndCommissionTransaction.controller";
import authMiddleware from "../../../middlewares/adminAuth";
const payoutAndCommissionRouter = express.Router();

payoutAndCommissionRouter
  .route("/:marketExecutiveId")
  .get(authMiddleware,getPayoutAndCommissionTrans)
  .post(authMiddleware,addPayout);

export default payoutAndCommissionRouter;
