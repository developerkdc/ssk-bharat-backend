import express from "express";
import {
  EditMECommission,
  addMECommission,
  listMECommissionBasedOnMET,
  listMECommissionDropdown,
  listingMECommissionBasedOnCompany,
} from "../../../controllers/Admin/MET/commission.controller";
import authMiddleware from "../../../middlewares/adminAuth";
const marketExecutiveCommissionRouter = express.Router();

marketExecutiveCommissionRouter.route("/").post(authMiddleware, addMECommission);

marketExecutiveCommissionRouter
  .route("/:id")
  .post(authMiddleware, listingMECommissionBasedOnCompany)
  .patch(authMiddleware, EditMECommission);

marketExecutiveCommissionRouter.route("/marketExecutiveCompany/:id").post(authMiddleware, listMECommissionBasedOnMET)
marketExecutiveCommissionRouter.route("/dropdown/:id").get(authMiddleware, listMECommissionDropdown)

export default marketExecutiveCommissionRouter;
