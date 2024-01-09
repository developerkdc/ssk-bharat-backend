import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import DynamicModel from "../../../Utils/DynamicModel";
import InventorySchema from "../../../database/schema/Inventory/RetailerInventory.schema";

export const RetailerInventoryList = catchAsync(async(req,res)=>{
    // let user = req.user;
    console.log("fdsfsdf")
    let user = "6598ecd7d1b23dfc8328ce36";
    const retailer = await mongoose.model("retailers").findById(user);
    const inventoryName = retailer.current_data.inventorySchema;
    const Inventoryschema = DynamicModel(inventoryName, InventorySchema);
    const products = await Inventoryschema.find();
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: products,
      message: "Successfully fetched the product list",
    });
    
})