import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import marketExectiveCommissionModel from "../../../database/schema/MET/marketExectiveCommission.schema";
import { approvalData } from "../../HelperFunction/approvalFunction";
import adminApprovalFunction from "../../HelperFunction/AdminApprovalFunction"
import MarketExecutiveModel from "../../../database/schema/MET/MarketExecutive.schema";
import mongoose from "mongoose";
import { dynamicSearch } from "../../../Utils/dynamicSearch";

export const listingMECommissionBasedOnCompany = catchAsync(
  async (req, res, next) => {
    const { string, boolean, numbers } = req?.body?.searchFields || {};
    const search = req.query.search || "";
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || "desc";
    const sortBy = req.query.sortBy || "current_data.commisionPercentage"

    let searchQuery = {};
    if (search != "" && req?.body?.searchFields) {
      const searchdata = dynamicSearch(search, boolean, numbers, string);
      searchQuery = searchdata;
    }
    const companyMarketExective = await marketExectiveCommissionModel.aggregate([
      {
        $match: { "current_data.companyId": new mongoose.Types.ObjectId(req.params.id), "current_data.status": true }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: "marketexecutives",
          foreignField: "_id",
          localField: "current_data.marketExecutiveId",
          pipeline: [
            {
              $project: {
                "current_data": {
                  company_details: 1,
                  contact_person_details: {
                    first_name: 1,
                    last_name: 1,
                    primary_email_id: 1,
                    primary_mobile_no: 1,
                  }
                }
              }
            }
          ],
          as: "current_data.marketExecutiveId"
        },
      },
      {
        $unwind: {
          path: "$current_data.marketExecutiveId",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: { ...searchQuery }
      },
      {
        $sort: { [sortBy]: sort === "desc" ? -1 : 1 }
      },
    ])

    const totalDocuments = await marketExectiveCommissionModel.countDocuments({
      ...searchQuery,
      "current_data.companyId": new mongoose.Types.ObjectId(req.params.id),
      "current_data.status": true
    })
    const totalPages = Math.ceil(totalDocuments / limit);


    return res.status(200).json({
      statusCode: 200,
      status: "success",
      length:companyMarketExective.length,
      data: {
        MarketExecutiveCommission: companyMarketExective,
      },
      totalPage:totalPages,
      message: "Commission Listing based on company"
    });
  }
);

export const listMECommissionDropdown = catchAsync(
  async (req, res, next) => {
    const companyMarketExective = await marketExectiveCommissionModel.find({ "current_data.companyId": req.params.id, "current_data.status": true })

    const listMarketExecutiveNotPresent = await MarketExecutiveModel.find({
      "current_data.status": true,
      "current_data.isActive": true,
      _id: { $nin: companyMarketExective.map(e => e.current_data.marketExecutiveId) }
    }, {
      "current_data.company_details": 1,
      "current_data.contact_person_details.first_name": 1,
      "current_data.contact_person_details.last_name": 1,
      "current_data.contact_person_details.primary_email_id": 1,
      "current_data.contact_person_details.primary_mobile_no": 1,
    })


    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        marketExecutiveList: listMarketExecutiveNotPresent,
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
        updated_at: Date.now(),
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
    message: "market executive commission has been updated"
  });
});
