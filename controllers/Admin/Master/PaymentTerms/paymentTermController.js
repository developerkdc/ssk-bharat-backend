import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import paymentTermDaysModel from "../../../../database/schema/Master/PaymentTerms/paymentTermDays.schema";
import { approvalData } from "../../../HelperFunction/approvalFunction";

export const createTermDays = catchAsync(async (req, res, next) => {
  const user = req.user;
  const termDays = await paymentTermDaysModel.create({
    current_data: { ...req.body },
    approver: approvalData(user),
  });

  if (termDays) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: termDays,
      message: "Payment Term Days Created",
    });
  }
});

export const getPaymentTermDays = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const sortField = req.query.sortBy || "created_at";

  const search = req.query.search || "";
  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "failed",
        data: {
          payment_term_days: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }
  const totalTerm = await paymentTermDaysModel.countDocuments({
    ...searchQuery,
    "current_data.status": true,
  });
  const totalPages = Math.ceil(totalTerm / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const termDays = await paymentTermDaysModel
    .find({ ...searchQuery, "current_data.status": true })
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (termDays) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        payment_term_days: termDays,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All Payment Term Days",
    });
  }
});

export const getPaymentTermList = catchAsync(async (req, res, next) => {
  const termDays = await paymentTermDaysModel.aggregate([
    {
      $match: { "current_data.status": true, "current_data.isActive": true },
    },
    {
      $project: {
        _id: 1,
        current_data: {
          payment_term_days: 1,
        },
      },
    },
  ]);
  if (termDays) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: termDays,
      message: "All Payment Term List",
    });
  }
});

export const updatePaymentTerm = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { payment_term_days } = req.body;
  const user = req.user;
  
  const updatedTermDays = await paymentTermDaysModel.findByIdAndUpdate(
    id,
    {
      $set: {
        "proposed_changes.payment_term_days": payment_term_days,
        "proposed_changes.status": false,
        "proposed_changes.isActive": req?.body?.isActive,
        approver: approvalData(user),
        updated_at: Date.now(),
      },
    },
    { new: true }
  );
  if (!updatedTermDays) {
    return next(new ApiError("Payment Term Days Not Found", 404));
  }
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: updatedTermDays,
    message: "Payment Term Days Updated",
  });
});
