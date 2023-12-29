import express from "express";
import { addFollowupAndRemark, addOfflinePayment } from "../../../controllers/Admin/OffinePayment/offlinePayment.controller";
const offlinePaymentRouter = express.Router();


offlinePaymentRouter.route("/payment/:id")
    .post(addOfflinePayment)

offlinePaymentRouter.route("/followup-remark/:id")
    .post(addFollowupAndRemark)

export default offlinePaymentRouter