import express from "express";
import { addPayout } from "../../controllers/Admin/payoutAndCommission/payoutAndCommissionTransaction.controller";
const payoutAndCommissionRouter = express.Router();

payoutAndCommissionRouter.route("/")
    .post(addPayout)

export default payoutAndCommissionRouter