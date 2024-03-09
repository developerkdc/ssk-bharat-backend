import express from "express";

import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";
import { getFaqs } from "../../../controllers/Admin/FAQs/faqController";

const router = express.Router();
router.get("/list", retailersAuthMiddleware, getFaqs);

export default router;
