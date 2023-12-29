import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import retailerPOModel from "../../../database/schema/retailerPurchaseOder.schema";
import OrdersModel from "../../../database/schema/order.schema";

export const createOfflineStorePO = catchAsync(async (req, res, next) => {
  let latestPONo = 1;
  const OrderNo = await OrdersModel.findOne()
    .sort({ created_at: -1 })
    .select("order_no")

  if (OrderNo) {
    latestPONo = OrderNo.order_no + 1;
  } else {
    latestPONo = 1;
  }
});

export const latestRetailerPONo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestPurchaseOrder = await retailerPOModel
      .findOne()
      .sort({ created_at: -1 })
      .select("purchase_order_no");
    if (latestPurchaseOrder) {
      return res.status(200).json({
        latest_po_number: latestPurchaseOrder.purchase_order_no + 1,
        statusCode: 200,
        status: "Latest Store PO Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        latest_po_number: 1,
        statusCode: 200,
        status: "Latest Store PO Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest store purchase order number:", error);
    throw error;
  }
});

export const getStorePo = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const filters = req.body.filters || {};

  const totalUnits = await retailerPOModel.countDocuments(filters);
  if (!totalUnits) throw new Error(new ApiError("No Data", 404));
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;
  const sortField = req.query.sortBy || "purchase_order_no";

  const purchaseOrder = await retailerPOModel
    .find(filters)
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
      message: "All Purchase Order",
    });
  }
});
