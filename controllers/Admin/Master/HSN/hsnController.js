import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import hsnCodeModel from "../../../../database/schema/Master/HSN/hsnCode.schema";
import adminApprovalFunction from "../../../HelperFunction/AdminApprovalFunction";
import { approvalData } from "../../../HelperFunction/approvalFunction";
import { createdByFunction } from "../../../HelperFunction/createdByfunction";

export const createHSN = catchAsync(async (req, res, next) => {
  const user = req.user;

  const hsnCode = await hsnCodeModel.create({
    current_data: { ...req.body, created_by: createdByFunction(user) },
    approver: approvalData(user),
  });

  if (!hsnCode) return new ApiError("Something went Wrong", 400);
  adminApprovalFunction({
    module: "hsncode",
    user: user,
    documentId: hsnCode._id,
  });
  if (hsnCode) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: hsnCode,
      message: "HSN Code Created",
    });
  }
});

export const getHSNCode = catchAsync(async (req, res, next) => {
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
          hsnCode: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }
  const totalGst = await hsnCodeModel.countDocuments({
    ...searchQuery,
    "current_data.status": true,
  });
  const totalPages = Math.ceil(totalGst / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const hsn = await hsnCodeModel.aggregate([
    {
      $match: { "current_data.status": true },
    },

    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "gsts", // Replace with the actual name of the collection containing gst_percentage
        localField: "current_data.gst_percentage",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              "current_data.gst_percentage": 1,
            },
          },
        ],
        as: "current_data.gst_percentage",
      },
    },
    {
      $unwind: "$current_data.gst_percentage",
    },
    {
      $match: { ...searchQuery },
    },
    {
      $sort: { [sortField]: sortDirection },
    },
  ]);

  if (hsn) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        hsnCode: hsn,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All HSN Code",
    });
  }
});

export const getHSNCodeList = catchAsync(async (req, res, next) => {
  const hsnCode = await hsnCodeModel.aggregate([
    {
      $match: { "current_data.status": true, "current_data.isActive": true },
    },
    {
      $lookup: {
        from: "gsts",
        foreignField: "_id",
        localField: "current_data.gst_percentage",
        as: "current_data.gst_percentage",
      },
    },
    {
      $unwind: "$current_data.gst_percentage",
    },
    {
      $project: {
        _id: 1,
        hsn_code: "$current_data.hsn_code",
        gst: {
          _id: "$current_data.gst_percentage._id",
          gst_percentage:
            "$current_data.gst_percentage.current_data.gst_percentage",
        },
      },
    },
  ]);

  if (hsnCode) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: hsnCode,
      message: "All HSN Code List",
    });
  }
});

export const updateHsnCode = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const hsnCode = await hsnCodeModel.findById(id);
  if (!hsnCode) {
    return next(new ApiError("HSN Code Not Found", 404));
  }
  const updatedHsnCode = await hsnCodeModel.findByIdAndUpdate(
    id,
    {
      $set: {
        "proposed_changes.hsn_code": req?.body?.hsn_code,
        "proposed_changes.gst_percentage": req?.body?.gst_percentage,
        "proposed_changes.status": false,
        "proposed_changes.isActive": req?.body?.isActive,
        updated_at: Date.now(),
        approver: approvalData(user),
      },
    },
    { new: true }
  );

  if (!updatedHsnCode) return new ApiError("Error while updating", 400);

  adminApprovalFunction({
    module: "hsncode",
    user: user,
    documentId: id,
  });

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: updatedHsnCode,
    message: "HSN Code Updated",
  });
});
