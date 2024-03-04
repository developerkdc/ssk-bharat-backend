import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import SalesModel from "../../../database/schema/SalesOrders/salesOrder.schema";
import { dynamicSearch } from "../../../Utils/dynamicSearch";

export const fetchOfflineConfirmSalesOrders = catchAsync(
  async (req, res, next) => {
    const user=req.offlineUser
    const { string, boolean, numbers } = req?.body?.searchFields || {};
    const id = user._id;
    const {
      page,
      limit = 10,
      sortBy = "created_at",
      sort = "desc",
      search,
    } = req.query;
    const skip = Math.max((page - 1) * limit, 0);

    const { to, from, ...data } = req?.body?.filters || {};
    const matchQuery = data || {};

    if (to && from) {
      matchQuery["current_data.sales_order_date"] = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    let searchQuery = {};
    if (search != "" && req?.body?.searchFields) {
      const searchdata = dynamicSearch(search, boolean, numbers, string);
      if (searchdata?.length == 0) {
        return res.status(404).json({
          statusCode: 404,
          status: "failed",
          data: {
            data: [],
          },
          message: "Results Not Found",
        });
      }
      searchQuery = searchdata;
    }

    const salesOrders = await SalesModel.aggregate([
      {
        $match: {
          ...matchQuery,
          ...searchQuery,
          "current_data.order_type": "offlinestores",
          "current_data.customer_details.customer_id":
            new mongoose.Types.ObjectId(id),
          "current_data.status": true,
        },
      },
      {
        $lookup: {
          from: "refunds", // Replace with the actual name of your refund collection
          localField: "current_data.refund_id",
          foreignField: "_id",  
          as: "current_data.refund_id",
        },
      },
      {
        $lookup: {
          from: "dispatchorders", // Replace with the actual name of your dispatch collection
          localField: "current_data.dispatch_id",
          foreignField: "_id",
          as: "current_data.dispatch_id",
        },
      },
      {
        $sort: { [sortBy]: sort == "desc" ? -1 : 1 },
      },
    ]);

    const totalDocuments = await SalesModel.countDocuments({
      ...matchQuery,
      ...searchQuery,
      "current_data.order_type": "offlinestores",
      "current_data.customer_details.customer_id": id,
      "current_data.status": true,
    });
    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      data: salesOrders,
      statusCode: 200,
      status: "success",
      message: `All Offline Store Sales Orders`,
      totalPages: totalPages,
    });
  }
);

export const getOrderNoFromSalesList = catchAsync(async (req, res, next) => {
  const type = req.params.type;
  const id = user._id;
  const orderNoFromSales = await SalesModel.aggregate([
    {
      $match: {
        "current_data.status": true,
        "current_data.order_type": type,
        "current_data.customer_details.customer_id":
          new mongoose.Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: "$current_data.order_no",
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  if (orderNoFromSales) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: orderNoFromSales,
      message: `All Offline Order No From Sales Order List`,
    });
  }
});
