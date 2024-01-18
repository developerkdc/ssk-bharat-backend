import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import tdsModel from "../../../../database/schema/Master/TDS/tds.schema";
import adminApprovalFunction from "../../../HelperFunction/AdminApprovalFunction";
import { approvalData } from "../../../HelperFunction/approvalFunction";
import { createdByFunction } from "../../../HelperFunction/createdByfunction";

export const createTds = catchAsync(async (req, res, next) => {
  const user = req.user;
  const tds = await tdsModel.create({
    current_data: { ...req.body, created_by: createdByFunction(user) },
    approver: approvalData(user),
  });

  if (!tds) return new ApiError("Error while Creating", 400);

  adminApprovalFunction({
    module: "tds",
    user: user,
    documentId: tds._id,
  });

  if (tds) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: tds,
      message: "TDS Created",
    });
  }
});

export const getTDS = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const sortField = req.query.sortBy || "created_at";

  //search functionality
  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "failed",
        data: {
          tds: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  //total pages
  const totalGst = await tdsModel.countDocuments({
    ...searchQuery,
    "current_data.status": true,
  });
  const totalPages = Math.ceil(totalGst / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const tds = await tdsModel
    .find({ ...searchQuery, "current_data.status": true })
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (tds) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        tds: tds,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All TDS",
    });
  }
});

export const getTDSList = catchAsync(async (req, res, next) => {
  const tds = await tdsModel.aggregate([
    {
      $match: { "current_data.status": true, "current_data.isActive": true },
    },
    {
      $project: {
        _id: 1,
        tds_percentage: "$current_data.tds_percentage",
      },
    },
  ]);
  if (tds) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: tds,
      message: "All TDS List",
    });
  }
});

export const updateTds = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const { tds_percentage, isActive } = req.body;

  const updatedtds = await tdsModel.findByIdAndUpdate(
    id,
    {
      $set: {
        "proposed_changes.tds_percentage": tds_percentage,
        "proposed_changes.status": false,
        "proposed_changes.isActive": isActive,
        approver: approvalData(user),
        updated_at: Date.now(),
      },
    },
    { new: true }
  );

  if (!updatedtds) return new ApiError("Error while updating", 400);

  adminApprovalFunction({
    module: "tds",
    user: user,
    documentId: id,
  });

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: updatedtds,
    message: "TDS Updated",
  });
});
