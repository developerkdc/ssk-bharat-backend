import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import ApiError from "../../../Utils/ApiError";
import InventorySchema from "../../../database/schema/Inventory/RetailerInventory.schema";
import BillSchema from "../../../database/schema/Retailers/Bills.schema";
import DynamicModel from "../../../Utils/DynamicModel";

export const createbill = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  let user = req.retailerUser;
  session.startTransaction();
  try {
    const retailer = await mongoose.model("retailers").findById(user);
    const billName = retailer.current_data.billingSchema;
    console.log(billName, "retailers", "---------------------");
    const BillsModel = DynamicModel(billName, BillSchema);
    let bills = await BillsModel.create([req.body], { session });
    console.log(bills[0].Items, "++++++++++++++++++");
    const inventoryName = retailer.current_data.inventorySchema;
    const retailerInveontry = DynamicModel(inventoryName, InventorySchema);
    for (const product of bills[0].Items) {
      const productId = product.product_Id;
      console.log(product.product_Id, "-----------------------------------");
      const inventoryProduct = await retailerInveontry.findOne({
        "itemsDetails.product_id": productId,
      });

      if (inventoryProduct) {
        const updatedQuantity =
          inventoryProduct.itemsDetails.availableQuantity - product.quantity;
        console.log(
          updatedQuantity,
          "updatedQuantityupdatedQuantityupdatedQuantityupdatedQuantityupdatedQuantity"
        );
        if (updatedQuantity < 0) {
          throw new Error(`Product with ID ${productId} is out of stock.`);
        }
        console.log(retailerInveontry, "uuuuuuuuuuuuuuuuuuuuuu");
        let data = await retailerInveontry.updateOne(
          { "itemsDetails.product_id":productId },
          { $set: { "itemsDetails.availableQuantity": updatedQuantity } }
        );
      } else {
        throw new Error(`Product with ID ${productId} not found in inventory.`);
      }
    }
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      statusCode: 200,
      data: bills,
      message: "Bill Created Successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(new ApiError(error.message, 400));
  }
});

export const Bills = catchAsync(async (req, res) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  // let BillNo = await BillsModel.countDocuments();
  let searchQuery = {};
  const matchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "Failed",
        data: {
          Bills: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }
  const totalUnits = await BillsModel.countDocuments({
    ...matchQuery,
    ...searchQuery,
  });
  if (!totalUnits) throw new Error(new ApiError("No Data", 404));
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const sortField = req.query.sortBy || "Name";
  let AllBills = await BillsModel.find({ ...matchQuery, ...searchQuery })
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);
  console.log(AllBills);
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: AllBills,
    message: "Bills fetched successfully",
  });
});

export const latestRetailerBillNo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestBillNo = await BillsModel.findOne()
      .sort({ created_at: -1 })
      .select("BillNo");
    if (latestBillNo) {
      return res.status(200).json({
        latest_bill_number: latestBillNo.BillNo + 1,
        statusCode: 200,
        status: "Latest Stored Bill Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        latest_bill_number: 1,
        statusCode: 200,
        status: "Latest Stored Bill Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest stored bill number:", error);
    throw error;
  }
});
