import express from "express";
import { Approved, getApprovalPendingList } from "../../controllers/Approvals/approval.controller";
const approvalRouter = express.Router();

approvalRouter.route("/:userId")
    .get(getApprovalPendingList)
    .patch(Approved)


export default approvalRouter