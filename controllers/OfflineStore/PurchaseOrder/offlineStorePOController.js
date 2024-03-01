import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import storePOModel from "../../../database/schema/PurchaseOrders/offlineStorePurchaseOrder.schema";
import { dynamicSearch } from "../../../Utils/dynamicSearch";

export const getStorePoByStoreId = catchAsync(async (req, res, next) => {
  const user=req.offlineUser
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
  console.log(matchQuery,"offline")
  const totalUnits = await storePOModel.countDocuments({
    ...matchQuery,
    ...searchQuery,
    "store_details.store_id": user._id, //replace id with login user
  });

  if (!totalUnits) throw new Error(new ApiError("No Data", 404));
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const sortField = req.query.sortBy || "created_at";

  const purchaseOrder = await storePOModel
    .find({
      ...matchQuery,
      ...searchQuery,
      "store_details.store_id": user._id,
    })
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
      message: "All Offline Store Purchase Order",
    });
  }
});
