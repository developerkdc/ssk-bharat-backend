import express from "express";
import { getFaqs } from "../../../controllers/Admin/FAQs/faqController";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";

const router = express.Router();
router.get("/list", offlineStoreAuthMiddleware, getFaqs);

export default router;
