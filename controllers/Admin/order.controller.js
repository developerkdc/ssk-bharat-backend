import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import storePOModel from "../../database/schema/offlineStorePurchaseOrder.schema";
import OrdersModel from "../../database/schema/order.schema";
import mongoose from "mongoose";

export const createNewOrder = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { order_date, customer_details, ssk_details: sskData } = req.body;

    // Create a new order
    const newOrder = await OrdersModel.create([req.body], { session });

    // Create a new store purchase order
    let latestPoNo = 1;
    const latestStorePurchaseOrder = await storePOModel
      .findOne()
      .sort({ created_at: -1 })
      .select("purchase_order_no")
      .session(session);

    if (latestStorePurchaseOrder) {
      latestPoNo = latestStorePurchaseOrder.purchase_order_no + 1;
    } else {
      latestPoNo = 1;
    }

    const storePO = await storePOModel.create(
      [
        {
          purchase_order_no: latestPoNo,
          purchase_order_date: order_date,
          ssk_details: { ...sskData, supplier_id: sskData.ssk_id },
          store_details: {
            ...customer_details,
            store_id: customer_details.customer_id,
          },
          ...req.body,
        },
      ],
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    if (newOrder && storePO) {
      return res.status(201).json({
        statusCode: 201,
        status: true,
        data: newOrder,
        message: "Order Created",
      });
    }
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    next(new ApiError(error.message, 400));
  }
});

export const latestOrderNo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestOrder = await OrdersModel.findOne()
      .sort({ created_at: -1 })
      .select("order_no");
    if (latestOrder) {
      return res.status(200).json({
        latest_order_number: latestOrder.order_no + 1,
        statusCode: 200,
        status: "Latest Order Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        latest_order_number: 1,
        statusCode: 200,
        status: "Latest Order Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest purchase order number:", error);
    throw error;
  }
});

export const fetchOrders = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const matchQuery = {
    order_type: type,
    ...(req.body.filters || {}),
  };

  const orders = await OrdersModel.find(matchQuery)
    .skip(skip)
    .limit(limit)
    .exec();

  const totalDocuments = await OrdersModel.countDocuments(matchQuery);
  const totalPages = Math.ceil(totalDocuments / limit);

  if (orders.length === 0) {
    return next(new ApiError("No Data Found", 404));
  }

  return res.status(200).json({
    data: orders,
    statusCode: 200,
    status: `All ${type} Orders`,
    totalPages: totalPages,
    currentPage: page,
  });
});

