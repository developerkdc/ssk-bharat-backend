import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import SalesModel from "../../../database/schema/SalesOrders/salesOrder.schema";

export const fetchOfflineConfirmSalesOrders = catchAsync(
  async (req, res, next) => {
    const id = "65955886032241700db0c01f";
    const {
      page,
      limit = 10,
      sortBy = "created_at",
      sort = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    const { to, from, ...data } = req?.body?.filters || {};
    const matchQuery = data || {};

    if (to && from) {
      matchQuery.sales_order_date = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }
    const salesOrders = await SalesModel.find({
      ...matchQuery,
      "current_data.order_type": "retailers",
      "current_data.customer_details.customer_id": id,
      "current_data.status": true,
    })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sort })
      .exec();

    const totalDocuments = await SalesModel.countDocuments({
      ...matchQuery,
      "current_data.order_type": "retailers",
      "current_data.customer_details.customer_id": id,
      "current_data.status": true,
    });
    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      data: salesOrders,
      statusCode: 200,
      status: "success",
      message: `All Retailers Sales Orders`,
      totalPages: totalPages,
    });
  }
);
