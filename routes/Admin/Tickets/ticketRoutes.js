import express from "express";
import rolesPermissions from "../../../middlewares/rolesPermissionAuth";
import authMiddleware from "../../../middlewares/adminAuth";
import {
  createTicket,
  replyTicket,
  ticketList,
  updateTicketStatus,
} from "../../../controllers/Admin/Tickets/ticketController";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  rolesPermissions("ticket", "add"),
  createTicket
);
router.patch(
  "/reply/:id",
  authMiddleware,
  rolesPermissions("ticket", "edit"),
  replyTicket
);
router.patch(
  "/update-status/:id",
  authMiddleware,
  rolesPermissions("ticket", "edit"),
  updateTicketStatus
);
router.get(
  "/list",
  authMiddleware,
  rolesPermissions("ticket", "view"),
  ticketList
);

export default router;
