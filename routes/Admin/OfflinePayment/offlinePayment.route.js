import express from "express";
import { addFollowupAndRemark, addOfflinePayment, getOfflinePaymentDetails } from "../../../controllers/Admin/OfflinePayment/offlinePayment.controller.js";
const offlinePaymentRouter = express.Router();


offlinePaymentRouter.route("/")
    .get(getOfflinePaymentDetails)

offlinePaymentRouter.route("/payment/:id")
    .post(addOfflinePayment)

offlinePaymentRouter.route("/followup-remark/:id")
    .post(addFollowupAndRemark)

export default offlinePaymentRouter