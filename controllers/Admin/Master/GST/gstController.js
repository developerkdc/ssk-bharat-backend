import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import gstModel from "../../../../database/schema/Master/GST/gst.schema";
import { approvalData } from "../../../HelperFunction/approvalFunction";
export const createGst = catchAsync(async (req, res, next) => {
  const user = req.user;
  const gst = await gstModel.create({
    current_data:{...req.body},
    approver:approvalData(user)
  });
  if (gst) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",

      data: gst,
      message: "GST Created",
    });
  }
});

export const getGST = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const sortField = req.query.sortBy;

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "failed",
        data: {
          gst: [],
          // totalPages: 1,
          // currentPage: 1,
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  const totalGst = await gstModel.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalGst / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const gst = await gstModel
    .find(searchQuery)
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (gst) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        gst: gst,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All GST",
    });
  }
});

export const getGstList = catchAsync(async (req, res, next) => {
  const gst = await gstModel.aggregate([
    {
      $project: {
        _id: 1,
        "current_data.gst_percentage": 1,
      },
    },
  ]);
  if (gst) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",

      data: gst,
      message: "All GST List",
    });
  }
});

export const updateGst = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {gst_percentage,status} = req.body;
  const user = req.user;

  const updatedGst = await gstModel.findByIdAndUpdate(
    id,
    {
      $set:{
        "proposed_changes.gst_percentage": gst_percentage,
        "proposed_changes.status":false,
        approver:approvalData(user)
    }
    },
    { new: true }
  );

  if (!updatedGst) {
    return next(new ApiError("GST Not Found", 404));
  }
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: updatedGst,
    message: "GST Updated",
  });
});
