import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import storePOModel from "../../../database/schema/PurchaseOrders/offlineStorePurchaseOrder.schema";
import OrdersModel from "../../../database/schema/Orders/order.schema";
import mongoose from "mongoose";
import { approvalData } from "../../HelperFunction/approvalFunction";

export const createNewOrder = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const user = req.user;

  try {
    const { order_date, customer_details, ssk_details: sskData } = req.body;

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
          ...req.body,
          purchase_order_no: latestPoNo,
          purchase_order_date: order_date,
          ssk_details: {
            ...sskData,
            supplier_id: sskData.ssk_id,
            supplier_name: sskData.ssk_name,
          },
          store_details: {
            ...customer_details,
            store_id: customer_details.customer_id,
            store_name: customer_details.customer_name,
          },
        },
      ],
      { session }
    );
    const newOrder = await OrdersModel.create(
      [
        {
          current_data: {
            ...req.body,
            purchase_order_id: storePO[0]?._id,
            purchase_order_no: storePO[0]?.purchase_order_no  
          },
          approver: approvalData(user),
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
        status: "success",
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
      .select("current_data.order_no");
    if (latestOrder) {
      return res.status(200).json({
        order_no: latestOrder.current_data.order_no + 1,
        statusCode: 200,
        status: "Latest Order Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        order_no: 1,
        statusCode: 200,
        status: "Latest Order Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest order number:", error);
    throw error;
  }
});

export const fetchOrders = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const {
    type,
    page,
    limit = 10,
    sortBy = "order_no",
    sort = "desc",
  } = req.query;
  const skip = (page - 1) * limit;

  const search = req.query.search || "";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        data: {
          data: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  const { to, from, ...data } = req?.body?.filters || {};
  const matchQuery = data || {};
  if (type) {
    matchQuery.order_type = type;
  }

  if (to && from) {
    matchQuery.order_date = { $gte: new Date(from) };
    matchQuery.estimate_delivery_date = { $lte: new Date(to) };
  }

  const totalDocuments = await OrdersModel.countDocuments({
    ...matchQuery,
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocuments / limit);

  const orders = await OrdersModel.find({ ...matchQuery, ...searchQuery,"current_data.status":true })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sort })
    .exec();

  return res.status(200).json({
    data: orders,
    statusCode: 200,
    status: "success",
    message: `All ${type} Orders`,
    totalPages: totalPages,
  });
});
