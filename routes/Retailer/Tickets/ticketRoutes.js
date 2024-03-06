import express from "express";
import {
  createTicket,
  replyTicket,
  ticketList,
} from "../../../controllers/Retailers/Tickets/ticketController";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";

const router = express.Router();

router.post("/add", retailersAuthMiddleware, createTicket);
router.patch("/reply/:id", retailersAuthMiddleware, replyTicket);
router.post("/list", retailersAuthMiddleware, ticketList);

export default router;
