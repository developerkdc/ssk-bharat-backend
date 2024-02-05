import express from "express";
import {
  EditMECommission,
  addMECommission,
  listingMECommissionBasedOnCompany,
} from "../../../controllers/Admin/MET/commission.controller";
import authMiddleware from "../../../middlewares/adminAuth";
const marketExecutiveCommissionRouter = express.Router();

marketExecutiveCommissionRouter.route("/").post(authMiddleware,addMECommission);

marketExecutiveCommissionRouter
  .route("/:id")
  .get(authMiddleware,listingMECommissionBasedOnCompany)
  .patch(authMiddleware,EditMECommission);

export default marketExecutiveCommissionRouter;
