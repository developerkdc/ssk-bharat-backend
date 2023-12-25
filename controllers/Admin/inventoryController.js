import ApiError from "../../Utils/ApiError.js";
import catchAsync from "../../Utils/catchAsync.js";
import inventoryModel from "../../database/schema/Inventory.schema.js";
import sampleInmodel from "../../database/schema/SampleInward.schema.js";


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
 return res.status(201).json({
    status: "success",
    data: {
      inventory,
    },
 });
})

export const EditInventory = catchAsync(async(req,res)=>{
   const purchaseOrderNo = req.params.purchaseOrderNo;
    const updates = req.body;

    if (mongoose.Types.ObjectId.isValid(purchaseOrderNo)) {
      const result = await inventoryModel.updateOne(
        { purchaseOrderNo: purchaseOrderNo },
        { $set: updates }
      );

      if (result.length === 0) {
       return res.status(404).send({ message: "Inventory not found" });
      } else {
        return res.status(200).send({ message: "Inventory updated successfully" });
      }
    } else {
      return res.status(400).send({ message: "Invalid Inventory Id" });
    }
 }) 

 export const AddSampleInward = catchAsync(async(req,res)=>{
  
  const sampleInward = await sampleInmodel.create(req.body);

  return res.status(201).json({
    statusCode:201,
    message:"Success",
    data:sampleInward
  })

 })

 export const InventoryList = catchAsync(async(req,res)=>{
    let InventoryProducts = await inventoryModel.aggregate([
      {
        $unwind: "$itemsDetails",
      },
      {
        $group: {
          _id: "$itemsDetails.itemName",
          totalAvailableQty: { $sum: "$itemsDetails.quantity" },
          details: {
            $push: {
              supplierName: "$supplierDetails.billto.companyName",
              invoiceNumber: "$invoiceDetails.invoiceNo",
              invoiceDate: "$invoiceDetails.invoiceDate",
              purchaseOrderNumber: "$purchaseOrderNo",
              qtyReceived: "$itemsDetails.receivedQuantity",
              receivedDate: "$receivedDate",
              transportDetails: "$transportDetails",
            },
          },
        },
      },
    ]);
    return res.status(200).json({
      statusCode: 200,
      message: "Details Fetched successfully",
      data: InventoryProducts,
    });

 })