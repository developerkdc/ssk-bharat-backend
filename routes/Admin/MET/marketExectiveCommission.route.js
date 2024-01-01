import express from "express";
import {
  EditMECommission,
  addMECommission,
  listingMECommissionBasedOnReatiler,
} from "../../../controllers/Admin/MET/commission.controller";
const marketExecutiveCommissionRouter = express.Router();

marketExecutiveCommissionRouter.route("/").post(addMECommission);

marketExecutiveCommissionRouter
  .route("/:id")
  .get(listingMECommissionBasedOnReatiler)
  .patch(EditMECommission);

export default marketExecutiveCommissionRouter;
