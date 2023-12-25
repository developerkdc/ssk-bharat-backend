import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import sskPOModel from "../../../database/schema/SSKPurchaseOrder.schema";

export const createSSKPO = catchAsync(async (req, res, next) => {
  const po = await sskPOModel.create(req.body);
  if (po) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: po,
      message: "Purchase Order Created",
    });
  }
});

export const latestSSKPONo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestPurchaseOrder = await sskPOModel
      .findOne()
      .sort({ created_at: -1 })
      .select("purchase_order_no");
    console.log(latestPurchaseOrder, "lateee");
    if (latestPurchaseOrder) {
      return res.status(200).json({
        latest_po_number: latestPurchaseOrder.purchase_order_no + 1,
        statusCode: 200,
        status: "Latest PO Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        latest_po_number: 1,
        statusCode: 200,
        status: "Latest PO Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest purchase order number:", error);
    throw error;
  }
});

export const getSSKPo = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const filters = req.body.filters || {};
  const searchQuery = buildSearchQuery(search);

  const totalUnits = await sskPOModel.countDocuments(searchQuery);
  if (!totalUnits) throw new Error(new ApiError("No Data", 404));
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;
  const sortField = req.query.sortBy || "purchase_order_no";

  const purchaseOrder = await sskPOModel
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

// Function to build search query
function buildSearchQuery(search) {
  const searchQuery = {};
  if (search) {
    searchQuery.$or = [
      { purchase_order_no: parseInt(search) },
      // Add more fields to search as needed
    ];
  }
  return searchQuery;
}

export const updatePOStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body, "req.body");
  const updatePO = await sskPOModel.findOneAndUpdate(
    { _id: id }, // Assuming 'id' is the unique identifier field
    { $set: { status: req.body.status } },
    { new: true } // This option returns the updated document
  );
  if (!updatePO) return next(new ApiError("Purchase Order Not Found", 404));
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatePO,
    message: "Status Updated",
  });
});

export const getPOBasedOnSupplierID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body, "req.body");
  const poDetails = await sskPOModel.aggregate([
    {
      $match: {
        "supplier_details.supplier_id": new mongoose.Types.ObjectId(id),
      },
    },
  ]);

  if (poDetails.length == 0)
    return next(new ApiError("Purchase Order Not Found", 404));
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: poDetails,
    message: "SSK Purchased Order Based on Supplier",
  });
});


//new Order
export const createPOForStore = catchAsync(async (req, res, next) => {
  console.log(req.body)
  // const po = await sskPOModel.create(req.body);
  // if (po) {
  //   return res.status(201).json({
  //     statusCode: 201,
  //     status: true,
  //     data: po,
  //     message: "Purchase Order Created",
  //   });
  // }
});
