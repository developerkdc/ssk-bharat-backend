import express from "express";
import { Approved, ApprovedByAdmin, getApprovalPendingList } from "../../controllers/Approvals/approval.controller";
const approvalRouter = express.Router();

approvalRouter.route("/:userId")
    .get(getApprovalPendingList)
    .patch(Approved)

approvalRouter.patch("/admin",ApprovedByAdmin)

export default approvalRouter