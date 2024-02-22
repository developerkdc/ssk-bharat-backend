import express from "express";
import { addFollowupAndRemark, addOfflinePayment, getOfflinePaymentDetails, updatePaymentStatus } from "../../../controllers/Admin/OfflinePayment/offlinePayment.controller.js";
import authMiddleware from "../../../middlewares/adminAuth.js";
const offlinePaymentRouter = express.Router();


offlinePaymentRouter.route("/")
    .post(authMiddleware,getOfflinePaymentDetails)

offlinePaymentRouter.route("/payment/:id")
    .post(authMiddleware,addOfflinePayment)
    .patch(authMiddleware,updatePaymentStatus)

offlinePaymentRouter.route("/followup-remark/:id")
    .post(authMiddleware,addFollowupAndRemark)

export default offlinePaymentRouter