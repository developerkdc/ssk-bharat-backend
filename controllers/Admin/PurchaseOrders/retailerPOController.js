import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import retailerPOModel from "../../../database/schema/PurchaseOrders/retailerPurchaseOder.schema";
import OrdersModel from "../../../database/schema/Orders/order.schema";
import { dynamicSearch } from "../../../Utils/dynamicSearch";

export const createRetailerPO = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      purchase_order_date,
      ssk_details: poData,
      retailer_details,
    } = req.body;

    // Create a new order
    const retailerPO = await retailerPOModel.create([req.body], { session });

    // Create a new store purchase order
    let latestOrderNo = 1;
    const OrderNo = await OrdersModel.findOne()
      .sort({ created_at: -1 })
      .select("order_no")
      .session(session);

    if (OrderNo) {
      latestOrderNo = OrderNo.order_no + 1;
    } else {
      latestOrderNo = 1;
    }
    const addNewOrder = await OrdersModel.create(
      [
        {
          ...req.body,
          order_no: latestOrderNo,
          order_type: "retailers",
          order_date: purchase_order_date,
          ssk_details: {
            ...poData,
            ssk_id: poData.supplier_id,
            ssk_name: poData.supplier_name,
          },
          customer_details: {
            ...retailer_details,
            customer_id: retailer_details.retailer_id,
            customer_name: retailer_details.retailer_name,
          },
        },
      ],
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    if (addNewOrder && retailerPO) {
      return res.status(201).json({
        statusCode: 201,
        status: "success",
        data: retailerPO,
        message: "Retailer Purchase Order Created",
      });
    }
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    next(new ApiError(error.message, 400));
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
        message: "Latest Retailer PO Number",
        status: "success",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        latest_po_number: 1,
        statusCode: 200,
        message: "Latest Retailer PO Number",
        status: "success",
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
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields ) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "failed",
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
    matchQuery.purchase_order_date = { $gte: new Date(from) };
    matchQuery.estimate_delivery_date = { $lte: new Date(to) };
  }

  const totalUnits = await retailerPOModel.countDocuments({...matchQuery,...searchQuery});
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;
  const sortField = req.query.sortBy || "purchase_order_no";

  const purchaseOrder = await retailerPOModel
    .find({...matchQuery,...searchQuery})
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (purchaseOrder) {
    return res.status(200).json({ 
      statusCode: 200,
      status: "success",
      data: {
        purchaseOrder: purchaseOrder,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All Retailer Purchase Order",
    });
  }
});
