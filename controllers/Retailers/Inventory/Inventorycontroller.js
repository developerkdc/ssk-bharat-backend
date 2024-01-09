import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import DynamicModel from "../../../Utils/DynamicModel";
import InventorySchema from "../../../database/schema/Inventory/RetailerInventory.schema";

export const RetailerInventoryList = catchAsync(async(req,res)=>{
    // let user = req.user;
    let user = "6598ecd7d1b23dfc8328ce36";
    const retailer = await mongoose.model("retailers").findById(user);
    const inventoryName = retailer.current_data.inventorySchema;
    const Inventoryschema = DynamicModel(inventoryName, InventorySchema);
    // const products = await Inventoryschema.find();
    console.log(Inventoryschema);
 
    const result = await Inventoryschema.aggregate([
      { $unwind: "$itemsDetails" },
      {
        $lookup: {
          from: "products",
          localField: "itemsDetails.product_Id",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },
      {
        $group: {
          _id: {
            itemName: "$itemsDetails.item_name",
            category: "$itemsDetails.category",
            sku: "$itemsDetails.sku",
            hsnCode: "$itemsDetails.hsn_code",
          },
          totalAvailableQuantity: { $sum: "$itemsDetails.availableQuantity" },
          itemImage: { $addToSet: "$productData.product_images" },
        },
      },

      {
        $project: {
          _id: 0,
          itemName: "$_id.itemName",
          category: "$_id.category",
          sku: "$_id.sku",
          hsnCode: "$_id.hsnCode",
          totalAvailableQuantity: 1,
          itemImage: 1,
        },
      },
    ]);
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: result,
      message: "Successfully fetched the product list",
    });
    
})