import mongoose from "mongoose";
import catchAsync from "../../Utils/catchAsync";
import DynamicModel from "../../Utils/DynamicModel";
import InventorySchema from "../../database/schema/Inventory/RetailerInventory.schema";

const RetailerInventory = catchAsync(async(req,res)=>{
    // let user = req.user;
    let user = "6596b712c68d5a79159c41e0";
    const retailer = await mongoose.model("retailers").findById(user);
    const inventoryName = retailer.current_data.inventorySchema;
    const retailerInveontry = DynamicModel(inventoryName, InventorySchema);
    const products = await retailerInveontry.find()
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: products,
      message: "Successfully fetched the product list",
    });
    
})