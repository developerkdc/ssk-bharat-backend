import ApiError from "../../Utils/ApiError.js";
import catchAsync from "../../Utils/catchAsync.js";
import inventoryModel from "../../database/schema/Inventory.schema.js";

export const AddStock= catchAsync(async(req,res)=>{
    const inventory = new inventoryModel({
      purchaseOrderNo: req.body.purchaseOrderNo,
      supplierCompanyName: req.body.supplierCompanyName,
      receivedDate: req.body.receivedDate,
      supplierDetails: req.body.supplierDetails,
      itemsDetails: req.body.itemsDetails,
      transportDetails: req.body.transportDetails,
      invoiceDetails: req.body.invoiceDetails,
      approvals: req.body.approvals,
    });

 // Save the new inventory object to the database
  await inventory.save();

 // Send a response to the client
 res.status(201).json({
    status: "success",
    data: {
      inventory,
    },
 });
})
