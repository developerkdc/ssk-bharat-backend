import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import refundModel from "../../../database/schema/SalesOrders/refund.schema";
import SalesModel from "../../../database/schema/SalesOrders/salesOrder.schema";
import adminApprovalFunction from "../../HelperFunction/AdminApprovalFunction";
import { approvalData } from "../../HelperFunction/approvalFunction";
import { createdByFunction } from "../../HelperFunction/createdByfunction";

export const createRefund = catchAsync(async (req, res, next) => {
  const session = await refundModel.startSession();
  session.startTransaction();

  try {
    const user = req.user;

    const refund = await refundModel.create(
      [{ current_data: { ...req.body, created_by: createdByFunction(user) } }],
      { session }
    );

    const salesOrder = await SalesModel.findByIdAndUpdate(
      req.body.sales_order_id,
      {
        $set: {
          "proposed_changes.refund_id": refund[0]._id,
          "proposed_changes.status": false,
          approver: approvalData(user),
          updated_at: Date.now(),
        },
      },
      { session, new: true } // { new: true } to return the updated document
    );
    
    await session.commitTransaction();
    await session.endSession();

    adminApprovalFunction({
      module: "refunds",
      user: user,
      documentId: refund[0]._id,
    });

    adminApprovalFunction({
      module: "salesorders",
      user: user,
      documentId: req.body.sales_order_id,
    });

    if (refund && salesOrder) {
      return res.status(201).json({
        statusCode: 201,
        status: true,
        data: refund,
        message: "Refund Data Created",
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

export const getRefundHist = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const { sortBy = "created_at" } = req.query;
  // Count total roles with or without search
  const totalRoles = await refundModel.countDocuments();
  const filters = req.body.filters || {};
  if (!totalRoles) {
    throw new Error(new ApiError("No Data", 404));
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalRoles / limit);
  if (page > totalPages) throw new Error(new ApiError("Invalid Page", 404));
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;

  // Fetch roles based on search and pagination
  const refund = await refundModel
    .find({ ...filters, "current_data.status": true })
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: {
      refund_data: refund,
      totalPages: totalPages,
      currentPage: validPage,
    },
    message: "All Sales Order Refund Data",
  });
});

export const getRefundBySalesId = catchAsync(async (req, res, next) => {
  const { salesid } = req.params;

  const refund = await refundModel.find({
    "current_data.sales_order_id": salesid,
    "current_data.status": true,
  });
  // if (refund.length == 0) {
  //   throw new Error(new ApiError("Refund Data Not Found", 404));
  // }
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: refund,
    message: "Refund Data",
  });
});
