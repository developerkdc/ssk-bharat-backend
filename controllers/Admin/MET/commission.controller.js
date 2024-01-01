import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import marketExectiveCommissionModel from "../../../database/schema/MET/marketExectiveCommission.schema";

export const listingMECommissionBasedOnReatiler = catchAsync(
  async (req, res, next) => {
    const retailerMarketExective = await marketExectiveCommissionModel
      .find({ companyId: req.params.id })
      .populate("companyId");
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
  const addCommission = await marketExectiveCommissionModel.create(req.body);
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
      ...req.body,
    }
  );

  if (!EditCommission.acknowledged)
    return next(new ApiError("updating the data hass been failed", 500));

  return res.status(200).json({
    statusCode: 200,
    status: "updated",
    data: {
      MarketExecutiveCommission: EditCommission,
    },
  });
});
