import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError.js";
import catchAsync from "../../../Utils/catchAsync.js";
import inventoryModel from "../../../database/schema/Inventory/Inventory.schema.js";
import sampleInmodel from "../../../database/schema/Samples/SampleInward.schema.js";
import sampleOut from "../../../database/schema/Samples/sampleOut.schema.js";
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

export const AddSampleInward = catchAsync(async (req, res, next) => {
  const challan = await sampleOut.findOne({
    deliveryChallanNo: req.body.challanNo,
  });
  if (!challan) {
    return next(new ApiError("challan Not Found", 404));
  }
  const sampleInward = await sampleInmodel.create(req.body);

  return res.status(201).json({
    statusCode: 201,
    message: "Success",
    data: sampleInward,
  });
});

export const EditSampleInward = catchAsync(async (req, res) => {
  const challanNo = req.params.id;
  const updates = req.body;
  const sampleData = await sampleInmodel.findOneAndUpdate(
    { challanNumber: challanNo },
    { $set: updates }
  );

  return res.status(200).json({
    statusCode: 200,
    message: "Data Updated",
    data: sampleData,
  });
});

export const InventoryList = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const searchParam = req.query.searchParam || "";
  const sortField = req.query.sortField || "_id.itemName";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const matchStage = {};
  if (searchParam) {
    matchStage.$or = [
      { "_id.itemName": { $regex: searchParam, $options: "i" } },
      { "_id.category": { $regex: searchParam, $options: "i" } },
      { "_id.sku": { $regex: searchParam, $options: "i" } },
      { "_id.hsn_code": { $regex: searchParam, $options: "i" } },
      {
        totalAvailableQuantity: {
          $eq: isNaN(searchParam) ? searchParam : +searchParam,
        },
      },
      {
        totalReservedQuantity: {
          $eq: isNaN(searchParam) ? searchParam : +searchParam,
        },
      },
      {
        totalBalanceQuantity: {
          $eq: isNaN(searchParam) ? searchParam : +searchParam,
        },
      },
    ];
  }

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
      $match: matchStage,
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
    {
      $sort: {
        [sortField]: sortOrder,
      },
    },
    {
      $skip: (page - 1) * 10,
    },
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
  const page = req.query.page || 1;
  const searchParam = req.query.searchParam || "";
  const sortField = req.query.sortField || "product_Id";
  const sortOrder = req.query.sortOrder || "asc";
  // const {invoiceDate,receiveDate,...data } = req?.body?.filters || {};
  console.log(req.body.filters);
  const limit = 10;
  const matchQuery = {
    "itemsDetails.product_Id": new mongoose.Types.ObjectId(id),
  };
  const filter = {};

  if (searchParam) {
    matchQuery["$or"] = [
      { purchaseOrderNo: { $regex: searchParam, $options: "i" } },
      { "supplierDetails.firstName": { $regex: searchParam, $options: "i" } },
      { "supplierDetails.lastName": { $regex: searchParam, $options: "i" } },
      {
        "supplierDetails.primaryEmailID": {
          $regex: searchParam,
          $options: "i",
        },
      },
      {
        "supplierDetails.primaryMobileNo": {
          $regex: searchParam,
          $options: "i",
        },
      },
      {
        "supplierDetails.address.address": {
          $regex: searchParam,
          $options: "i",
        },
      },
      { "itemsDetails.itemName": { $regex: searchParam, $options: "i" } },
      { "itemsDetails.category": { $regex: searchParam, $options: "i" } },
      { "itemsDetails.sku": { $regex: searchParam, $options: "i" } },
    ];
  }
  if (
    req?.body?.filters &&
    req?.body?.filters.invoiceDate &&
    req?.body?.filters.invoiceDate.to &&
    req?.body?.filters.invoiceDate.from
  ) {
    filter["invoiceDetails.invoiceDate"] = {
      $gte: new Date(req.body.filters.invoiceDate.from),
      $lte: new Date(req.body.filters.invoiceDate.to),
    };
  }

  if (
    req?.body?.filters &&
    req?.body?.filters.receiveDate &&
    req?.body?.filters.receiveDate.to &&
    req?.body?.filters.receiveDate.from
  ) {
    filter.receivedDate = {
      $gte: new Date(req.body.filters.receiveDate.from),
      $lte: new Date(req.body.filters.receiveDate.to),
    };
  }
  const result = await inventoryModel.aggregate([
    {
      $match: matchQuery,
    },
    {
      $match: filter,
    },
    {
      $sort: {
        [sortField]: sortOrder === "asc" ? 1 : -1,
      },
    },
    {
      $skip: (page - 1) * 10,
    },
    {
      $limit: limit,
    },
  ]);

  return res.status(200).json({
    data: result,
    statusCode: 200,
    totalcount: result.length,
    message: "Product History fetched Successfully!",
  });
});

export const reseverdQuantity = catchAsync(async (req, res) => {
  let productId = req.params.productId;
  let qty = req.query.qty;
  let products = await inventoryModel
      .find({
      "itemsDetails.product_Id": productId,
      "itemsDetails.balanceQuantity": { $gt: 0 },
    })
    .sort({ receivedDate: 1 });
  for (const product of products) {
    const availableQty = product.itemsDetails.availableQuantity;
    const balanceQty = product.itemsDetails.balanceQuantity;
    if(balanceQty!==0){
      const newReservedQty = Math.min(availableQty, qty); // Reserve up to qty or the received quantity, whichever is smaller
    const newBalanceQty = Math.max(balanceQty - qty, 0); // Ensure balance quantity is not negative
    console.log(newReservedQty);
    console.log(newBalanceQty);
    await inventoryModel.updateOne(
      { _id: product._id },
      {
        $set: {
          "itemsDetails.reservedQuantity": newReservedQty,
          "itemsDetails.balanceQuantity": newBalanceQty,
        },
      }
    );
    qty -= newReservedQty;
    if (qty <= 0) {
      break;
    }
    }
    else{
      continue;
    }
    
  }

  // Fetch the updated products
  products = await inventoryModel
    .find({ "itemsDetails.product_Id": productId })
    .sort({ receivedDate: 1 });

  return res.status(200).json({
    statusCode: 200,
    data: products,
  });
});
