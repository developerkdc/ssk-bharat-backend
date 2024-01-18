import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import marketExectiveCommissionModel from "../../../database/schema/MET/marketExectiveCommission.schema";
import { approvalData } from "../../HelperFunction/approvalFunction";
import adminApprovalFunction from "../../HelperFunction/AdminApprovalFunction"

export const listingMECommissionBasedOnReatiler = catchAsync(
  async (req, res, next) => {
    const retailerMarketExective = await marketExectiveCommissionModel
      .find({ "current_data.companyId": req.params.id,"current_data.status":true})
      .populate("current_data.companyId");
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        MarketExecutiveCommission: retailerMarketExective,
      },
    });
  }
);

export const addMECommission = catchAsync(async (req, res, next) => {
  const addCommission = await marketExectiveCommissionModel.create({ current_data: { ...req.body }, approver: approvalData(req.user) });

  adminApprovalFunction({
    module: "marketExectiveCommission",
    user: req.user,
    documentId: addCommission._id
  })

  return res.status(201).json({
    statusCode: 201,
    status: "created",
    data: {
      MarketExecutiveCommission: addCommission,
    },
  });
});

export const EditMECommission = catchAsync(async (req, res, next) => {
  const EditCommission = await marketExectiveCommissionModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        // "proposed_changes.companyId":req.body.companyId,
        // "proposed_changes.marketExecutiveId":req.body.marketExecutiveId,
        // "proposed_changes.companyType":req.body.companyType,
        "proposed_changes.onBoardingDate": req.body.onBoardingDate,
        "proposed_changes.commissionPercentage": req.body.commissionPercentage,
        "proposed_changes.isActive": req.body.isActive,
        "proposed_changes.status": req.body.status,
        updated_at:Date.now(),
        approver: approvalData(req.user)
      }
    }
  );

  if (!EditCommission.acknowledged) return next(new ApiError("updating the data hass been failed", 500));

  adminApprovalFunction({
    module: "marketExectiveCommission",
    user: req.user,
    documentId: req.params.id
  })

  return res.status(200).json({
    statusCode: 200,
    status: "updated",
    data: {
      MarketExecutiveCommission: EditCommission,
    },
  });
});
