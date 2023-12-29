import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import storePOModel from "../../../database/schema/offlineStorePurchaseOrder.schema";
import OrdersModel from "../../../database/schema/order.schema";

export const createOfflineStorePO = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      purchase_order_date,
      ssk_details: poData,
      store_details,
    } = req.body;

    // Create a new order
    const storePO = await storePOModel.create([req.body], { session });
    console.log(storePO, "storee");
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
          order_type: "Store",
          order_date: purchase_order_date,
          ssk_details: {
            ...poData,
            ssk_id: poData.supplier_id,
            ssk_name: poData.supplier_name,
          },
          customer_details: {
            ...store_details,
            customer_id: store_details.store_id,
            customer_name: store_details.store_name,
          },
        },
      ],
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    if (addNewOrder && storePO) {
      return res.status(201).json({
        statusCode: 201,
        status: true,
        data: storePO,
        message: "Purchase Order Created",
      });
    }
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    next(new ApiError(error.message, 400));
  }
});

export const latestStorePONo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestPurchaseOrder = await storePOModel
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

  const { to, from, ...data } = req?.body?.filters || {};
  const matchQuery = data || {};
  if (to && from) {
    matchQuery.purchase_order_date = { $gte: new Date(from) };
    matchQuery.estimate_delivery_date = { $lte: new Date(to) };
  }


  const totalUnits = await storePOModel.countDocuments(filters);
  if (!totalUnits) throw new Error(new ApiError("No Data", 404));
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;
  const sortField = req.query.sortBy || "purchase_order_no";

  const purchaseOrder = await storePOModel
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
      message: "All Offline Store Purchase Order",
    });
  }
});
