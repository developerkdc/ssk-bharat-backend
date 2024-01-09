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
    // console.log(Inventoryschema);
 
    const result = await Inventoryschema.aggregate([
      {
        $unwind: "$itemsDetails",
      },
      {
        $group: {
          _id: "$itemsDetails.product_Id",
          totalAvailableQuantity: { $sum: "$itemsDetails.availableQuantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $project: {
          productName: "$productData.item_name",
          category: "$productData.category",
          sku: "$productData.sku",
          hsnCode: "$productData.hsn_code",
          gst: "$productData.gst",
          itemImage: "$productData.product_images",
          totalAvailableQuantity: 1,
        },
      },
    ]);
    console.log(result) 
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: result,
      message: "Successfully fetched the product list",
    });
    
})