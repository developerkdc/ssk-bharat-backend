import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import DynamicModel from "../../../Utils/DynamicModel";
import InventorySchema from "../../../database/schema/Inventory/RetailerInventory.schema";

export const RetailerInventoryList = catchAsync(async (req, res) => {
  let user = req.retailerUser;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const searchQuery = req.query.search || "";
  const sortField = req.query.sortField || "receivedDate";
  const sortOrder = req.query.sortOrder || "asc";
  // console.log(sortField, "sortField", sortOrder, "sortOrder", page, "page");
  const retailer = await mongoose.model("retailers").findById(user);
  const inventoryName = retailer.current_data.inventorySchema;
  const Inventoryschema = DynamicModel(inventoryName, InventorySchema);

  const skip = (page - 1) * limit;

  const matchQuery = {};
  if (searchQuery) {
    matchQuery["productName"] = { $regex: searchQuery, $options: "i" };
  }

  const sortObject = {};
  sortObject[sortField] = sortOrder === "asc" ? 1 : -1;
  console.log(sortObject);
  const result = await Inventoryschema.aggregate([
    { $match: matchQuery },
    {
      $unwind: "$itemsDetails",
    },
    {
      $lookup: {
        from: "products",
        localField: "itemsDetails.product_id",
        foreignField: "_id",
        as: "productData",
      },
    },
    {
      $unwind: "$productData",
    },
    {
      $group: {
        _id: {
          product_id: "$itemsDetails.product_id",
          productName: "$itemsDetails.item_name",
          category: "$itemsDetails.category",
          sku: "$itemsDetails.sku",
          hsnCode: "$itemsDetails.hsn_code",
          itemImage: "$productData.current_data.product_images",
        },
        totalAvailableQuantity: { $sum: "$itemsDetails.availableQuantity" },
      },
    },
    {
      $project: {
        _id: 0,
        product_id: "$_id.product_id",
        productName: "$_id.productName",
        category: "$_id.category",
        sku: "$_id.sku",
        hsnCode: "$_id.hsnCode",
        itemImage: "$_id.itemImage",
        totalAvailableQuantity: 1,
      },
    },
    { $sort: sortObject },
    { $skip: skip },
    { $limit: limit },
  ]);

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    data: result,
    message: "Successfully fetched the product list",
    currentPage: page,
    totalPages: Math.ceil(result.length / limit),
    totalItems: result.length,
  });
});
