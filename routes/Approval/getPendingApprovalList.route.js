import express from "express";
import { Approved, ApprovedByAdmin, getApprovalPendingList } from "../../controllers/Approvals/approval.controller";
import authMiddleware from "../../middlewares/adminAuth";
const approvalRouter = express.Router();

approvalRouter.route("/")
    .get(authMiddleware,getApprovalPendingList)
    .patch(Approved)

approvalRouter.patch("/admin/approve",ApprovedByAdmin)

export default approvalRouter