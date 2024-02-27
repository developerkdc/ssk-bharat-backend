import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import SalesModel from "../../../database/schema/SalesOrders/salesOrder.schema";
import { dynamicSearch } from "../../../Utils/dynamicSearch";

export const fetchOfflineConfirmSalesOrders = catchAsync(
  async (req, res, next) => {
    const { string, boolean, numbers } = req?.body?.searchFields || {};
    const id = "65d11012cbc6fb8d5c726d98";
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

    const salesOrders = await SalesModel.find({
      ...matchQuery,
      ...searchQuery,
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
      ...searchQuery,
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


export const getOrderNoFromSalesList = catchAsync(async (req, res, next) => {
  const type = req.params.type;
  const id = "65d11012cbc6fb8d5c726d98";
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
      message: `All Retailer Order No From Sales Order List`,
    });
  }
});