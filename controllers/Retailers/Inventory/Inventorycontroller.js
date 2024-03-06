import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import DynamicModel from "../../../Utils/DynamicModel";
import InventorySchema from "../../../database/schema/Inventory/RetailerInventory.schema";

export const RetailerInventoryList = catchAsync(async (req, res) => {
  // let user = req.user;
  let user = req.retailerUser;
  console.log(user, "-------------------------");
  const retailer = await mongoose.model("retailers").findById(user);
  const inventoryName = retailer.current_data.inventorySchema;
  const Inventoryschema = DynamicModel(inventoryName, InventorySchema);
  // const products = await Inventoryschema.find();
  // console.log(Inventoryschema);

  const result = await Inventoryschema.aggregate([
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
  ]);
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    data: result,
    message: "Successfully fetched the product list",
  });
});
