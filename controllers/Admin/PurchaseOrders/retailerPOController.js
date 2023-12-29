import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import retailerPOModel from "../../../database/schema/retailerPurchaseOder.schema";

export const createRetailerPO = catchAsync(async (req, res, next) => {
  console.log(req.body,"bodyyyy")
  const po = await retailerPOModel.create(req.body);
  if (po) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: po,
      message: "Retailer Purchase Order Created",
    });
  }
});

export const latestRetailerPONo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestPurchaseOrder = await retailerPOModel
      .findOne()
      .sort({ created_at: -1 })
      .select("purchase_order_no");
      console.log(latestPurchaseOrder,"lateeestt")
    if (latestPurchaseOrder) {
      return res.status(200).json({
        latest_po_number: latestPurchaseOrder.purchase_order_no + 1,
        statusCode: 200,
        message: "Latest Retailer PO Number",
        status: true,
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        latest_po_number: 1,
        statusCode: 200,
        message: "Latest Retailer PO Number",
        status: true,
      });
    }
  } catch (error) {
    console.error(
      "Error getting latest retailer purchase order number:",
      error
    );
    throw error;
  }
});

export const getRetailerPo = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;

  const { to, from, ...data } = req?.body?.filters || {};
  const matchQuery = data || {};
  if (to && from) {
    matchQuery.purchase_order_date = { $gte: new Date(from) };
    matchQuery.estimate_delivery_date = { $lte: new Date(to) };
  }

  const totalUnits = await retailerPOModel.countDocuments(matchQuery);
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;
  const sortField = req.query.sortBy || "purchase_order_no";

  const purchaseOrder = await retailerPOModel
    .find(matchQuery)
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (purchaseOrder) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: {
        purchaseOrder: purchaseOrder,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All Retailer Purchase Order",
    });
  }
});
