import mongoose from "mongoose";
import ApiError from "../../Utils/ApiError.js";
import catchAsync from "../../Utils/catchAsync.js";
import inventoryModel from "../../database/schema/Inventory.schema.js";
import sampleInmodel from "../../database/schema/SampleInward.schema.js";

export const AddStock = catchAsync(async (req, res) => {
  const items = req.body.itemsDetails;
  const inventoryArray = [];
  for (const item of items) {
    const inventory = new inventoryModel({
      purchaseOrderNo: req.body.purchaseOrderNo,
      supplierCompanyName: req.body.supplierCompanyName,
      receivedDate: req.body.receivedDate,
      supplierDetails: req.body.supplierDetails,
      transportDetails: req.body.transportDetails,
      invoiceDetails: req.body.invoiceDetails,
      approvals: req.body.approvals,
      itemsDetails: {
        product_Id: item.product_Id,
        itemName: item.itemName,
        category: item.category,
        sku: item.sku,
        hsn_code: item.hsn_code,
        itemsWeight: item.itemsWeight,
        unit: item.unit,
        ratePerUnit: item.ratePerUnit,
        quantity: item.quantity,
        receivedQuantity: item.receivedQuantity,
        itemAmount: item.itemAmount,
        gstpercentage: item.gstpercentage,
        gstAmount: item.gstAmount,
        totalAmount: item.totalAmount,
        availableQuantity: item.receivedQuantity,
        balanceQuantity: item.receivedQuantity,
        reservedQuantity: 0,
      },
    });

    inventoryArray.push(inventory);
    await inventory.save();
  }

  // Send a response to the client
  return res.status(201).json({
    status: "success",
    data: {
      inventoryArray,
    },
  });
});

export const EditInventory = catchAsync(async (req, res) => {
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
      return res
        .status(200)
        .send({ message: "Inventory updated successfully" });
    }
  } else {
    return res.status(400).send({ message: "Invalid Inventory Id" });
  }
});

export const AddSampleInward = catchAsync(async (req, res) => {
  const sampleInward = await sampleInmodel.create(req.body);

  return res.status(201).json({
    statusCode: 201,
    message: "Success",
    data: sampleInward,
  });
});

export const InventoryList = catchAsync(async (req, res) => {
  const { page } = req.query.page || 1;
  const result = await inventoryModel.aggregate([
    {
      $unwind: "$itemsDetails",
    },
    {
      $lookup: {
        from: "products",
        localField: "itemsDetails.product_Id",
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
          itemName: "$itemsDetails.itemName",
          category: "$itemsDetails.category",
          sku: "$itemsDetails.sku",
          hsnCode: "$itemsDetails.hsn_code",
        },
        totalAvailableQuantity: { $sum: "$itemsDetails.availableQuantity" },
        totalResevedQuantity: { $sum: "$itemsDetails.reservedQuantity" },
        totalBalanceQuantity: { $sum: "$itemsDetails.balanceQuantity" },
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
        totalResevedQuantity: 1,
        totalBalanceQuantity: 1,
        itemImage: 1,
      },
    },
    // {
    //   $skip: (page - 1) * 10,
    // },
    {
      $limit: 10,
    },
  ]);
  return res.status(200).json({
    statusCode: 200,
    message: "Details Fetched successfully",
    data: result,
  });
});

export const ViewProductHistory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await inventoryModel.aggregate([
    {
      $match: {
        "itemsDetails.product_Id": new mongoose.Types.ObjectId(id),
      },
    },
  ]);
  return res.status(200).json({
    data: result,
    statusCode: 200,
    totalcout: result.length,
    message: "Product History fetched Successfully!",
  });
});
