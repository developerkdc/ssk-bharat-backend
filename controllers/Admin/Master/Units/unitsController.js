import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import unitModel from "../../../../database/schema/Master/Units/unit.schema";
import { approvalData } from "../../../HelperFunction/approvalFunction";

export const createUnit = catchAsync(async (req, res, next) => {
  const user = req.user;
  const unit = await unitModel.create({
    current_data: { ...req.body },
    approver: approvalData(user),
  });
  if (unit) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: unit,
      message: "Unit Created",
    });
  }
});

export const getUnits = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const sortField = req.query.sortBy || "created_at";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "failed",
        data: {
          units: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  const totalUnits = await unitModel.countDocuments({
    ...searchQuery,
    "current_data.status": true,
  });
  const totalPages = Math.ceil(totalUnits / limit);

  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const units = await unitModel
    .find({ ...searchQuery, "current_data.status": true })
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (!units) next(new ApiError("Data Not Found", 404));

  if (units) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        units: units,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All Units",
    });
  }
});

export const getUnitList = catchAsync(async (req, res, next) => {
  const unit = await unitModel.aggregate([
    {
      $match: { "current_data.status": true, "current_data.isActive": true },
    },
    {
      $project: {
        _id: 1,
        current_data: {
          unit_name: 1,
          unit_symbol: 1,
        },
      },
    },
  ]);

  if (unit) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: unit,
      message: "All unit List",
    });
  }
});

export const updateUnit = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const updatedUnit = await unitModel.findByIdAndUpdate(
    id,
    {
      $set: {
        "proposed_changes.unit_name": req?.body?.unit_name,
        "proposed_changes.unit_symbol": req?.body?.unit_symbol,
        "proposed_changes.status": false,
        "proposed_changes.isActive": req?.body?.isActive,
        updated_at: Date.now(),
        approver: approvalData(user),
      },
    },
    { new: true }
  );
  if (!updatedUnit) {
    return next(new ApiError("Unit Not Found", 404));
  }
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: updatedUnit,
    message: "Unit Updated",
  });
});
