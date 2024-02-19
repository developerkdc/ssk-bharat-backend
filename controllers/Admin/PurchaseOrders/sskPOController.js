import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import sskPOModel from "../../../database/schema/PurchaseOrders/SSKPurchaseOrder.schema";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import { approvalData } from "../../HelperFunction/approvalFunction";
import adminApprovalFunction from "../../HelperFunction/AdminApprovalFunction";
import { createdByFunction } from "../../HelperFunction/createdByfunction";

export const createSSKPO = catchAsync(async (req, res, next) => {
  const user = req.user;
  //latest po number
  const latestPurchaseOrder = await sskPOModel
    .findOne()
    .sort({ created_at: -1 })
    .select("current_data.purchase_order_no");
  const po = await sskPOModel.create({
    current_data: {
      purchase_order_no: latestPurchaseOrder
        ? latestPurchaseOrder?.current_data?.purchase_order_no + 1
        : 1,
      ...req.body,
      created_by: createdByFunction(user),
    },
    approver: approvalData(user),
  });
  if (!po) return new ApiError("Error while Creating", 400);
  adminApprovalFunction({
    module: "sskpurchaseorder",
    user: user,
    documentId: po._id,
  });
  if (po) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: po,
      message: "Purchase Order Created",
    });
  }
});

export const latestSSKPONo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestPurchaseOrder = await sskPOModel
      .findOne()
      .sort({ created_at: -1 })
      .select("current_data.purchase_order_no");
    if (latestPurchaseOrder) {
      return res.status(200).json({
        latest_po_number:
          latestPurchaseOrder.current_data.purchase_order_no + 1,
        statusCode: 200,
        status: "success",
        message: "Latest PO Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        latest_po_number: 1,
        statusCode: 200,
        status: "success",
        message: "Latest PO Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest purchase order number:", error);
    throw error;
  }
});

export const getSSKPo = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        data: {
          purchaseOrder: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }
  const { to, from, ...data } = req?.body?.filters || {};
  const matchQuery = data || {};
  if (to && from) {
    matchQuery["current_data.purchase_order_date"] = { $gte: new Date(from) };
    matchQuery["current_data.estimate_delivery_date"] = { $lte: new Date(to) };
  }

  const totalUnits = await sskPOModel.countDocuments({
    ...matchQuery,
    ...searchQuery,
  });
  console.log({ ...matchQuery });
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const sortField = req.query.sortBy || "purchase_order_no";

  const purchaseOrder = await sskPOModel
    .find({ ...matchQuery, ...searchQuery, "current_data.status": true })
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);
  console.log(matchQuery, searchQuery, sortField, sortDirection, "poooo");
  if (purchaseOrder) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: {
        purchaseOrder: purchaseOrder,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All Purchase Order",
    });
  }
});

export const updatePOStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const updatePO = await sskPOModel.findOneAndUpdate(
    { _id: id }, // Assuming 'id' is the unique identifier field
    {
      $set: {
        "proposed_changes.order_status": req.body.status,
        "proposed_changes.status": false,
        approver: approvalData(user),
        updated_at: Date.now(),
      },
    },
    { new: true } // This option returns the updated document
  );
  if (!updatePO) return next(new ApiError("Purchase Order Not Found", 404));

  adminApprovalFunction({
    module: "sskpurchaseorder",
    user: user,
    documentId: id,
  });
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatePO,
    message: "Status Updated",
  });
});

export const getPOBasedOnSupplierID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const poDetails = await sskPOModel.aggregate([
    {
      $match: {
        "current_data.supplier_details.supplier_id":
          new mongoose.Types.ObjectId(id),
      },
    },
  ]);

  if (poDetails.length == 0)
    return next(new ApiError("Purchase Order Not Found", 404));
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: poDetails,
    message: "SSK Purchased Order Based on Supplier",
  });
});
