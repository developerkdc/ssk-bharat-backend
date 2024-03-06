import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError.js";
import catchAsync from "../../../Utils/catchAsync.js";
import inventoryModel from "../../../database/schema/Inventory/Inventory.schema.js";
import sampleInmodel from "../../../database/schema/Samples/SampleInward.schema.js";
import sampleOut from "../../../database/schema/Samples/sampleOut.schema.js";
import { approvalData } from "../../HelperFunction/approvalFunction.js";
import adminApprovalFunction from "../../HelperFunction/AdminApprovalFunction.js";

export const AddStock = catchAsync(async (req, res) => {
  const user = req.user;
  let supplierDetails = JSON.parse(req.body.supplierDetails);
  let transportDetails = JSON.parse(req.body.transportDetails);
  transportDetails.transportType.deliveryChallanNo_image =
    req.files.deliveryChallanNo_image[0].path;
  let invoiceDetails = JSON.parse(req.body.invoiceDetails);
  invoiceDetails.uploadInviocePDF = req.files.uploadInviocePDF[0].path;
  const items = JSON.parse(req.body.itemsDetails);
  console.log(items);
  const inventoryArray = [];
  for (const item of items) {
    const inventory = new inventoryModel({
      current_data: {
        purchaseOrderNo: req.body.purchaseOrderNo,
        supplierCompanyName: req.body.supplierCompanyName,
        receivedDate: req.body.receivedDate,
        supplierDetails: supplierDetails,
        transportDetails: transportDetails,
        invoiceDetails: invoiceDetails,
        approvals: req.body.approvals,
        itemsDetails: {
          product_id: item.product_id,
          item_name: item.item_name,
          category: item.category,
          sku: item.sku,
          hsn_code: item.hsn_code,
          weight: item.weight,
          unit: item.unit,
          rate_per_unit: item.rate_per_unit,
          quantity: item.quantity,
          gst: item.gst,
          receivedQuantity: item.receivedQuantity,
          item_amount: item.item_amount,
          gstpercentage: item.gstpercentage,
          gstAmount: item.gstAmount,
          total_amount: item.total_amount,
          availableQuantity: item.receivedQuantity,
          balanceQuantity: item.receivedQuantity,
          reservedQuantity: 0,
        },
      },
      approver: approvalData(user),
    });

    inventoryArray.push(inventory);
    await inventory.save();
    adminApprovalFunction({
      module: "Inventory",
      user: user,
      documentId: inventory._id,
    });
  }
  // Send a response to the client
  return res.status(201).json({
    status: "success",
    data: { inventoryArray },
    statusCode: 201,
    message: "Product Added to Inventory Successfully",
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

// export const InventoryList = catchAsync(async (req, res) => {
//   const page = req.query.page || 1;
//   const searchParam = req.query.searchParam || "";
//   const sortField = req.query.sortField || "current_data.itemsDetails.itemName";
//   const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
//   const matchStage = {};
//   if (searchParam) {
//     matchStage.$or = [
//       { "_id.itemName": { $regex: searchParam, $options: "i" } },
//       { "_id.category": { $regex: searchParam, $options: "i" } },
//       { "_id.sku": { $regex: searchParam, $options: "i" } },
//       { "_id.hsn_code": { $regex: searchParam, $options: "i" } },
//       {
//         totalAvailableQuantity: {
//           $eq: isNaN(searchParam) ? searchParam : +searchParam,
//         },
//       },
//       {
//         totalReservedQuantity: {
//           $eq: isNaN(searchParam) ? searchParam : +searchParam,
//         },
//       },
//       {
//         totalBalanceQuantity: {
//           $eq: isNaN(searchParam) ? searchParam : +searchParam,
//         },
//       },
//     ];
//   }

//   const result = await inventoryModel.aggregate([
//     {
//       $unwind: "$current_data.itemsDetails",
//     },
//     {
//       $lookup: {
//         from: "products",
//         localField: "current_data.itemsDetails.product_Id",
//         foreignField: "_id",
//         as: "productData",
//       },
//     },
//     {
//       $unwind: "$productData",
//     },
//     {
//       $group: {
//         _id: {
//           itemName: "$current_data.itemsDetails.itemName",
//           category: "$current_data.itemsDetails.category",
//           sku: "current_data.$itemsDetails.sku",
//           hsnCode: "$current_data.itemsDetails.hsn_code",
//         },
//         totalAvailableQuantity: { $sum: "$current_data.itemsDetails.availableQuantity" },
//         totalResevedQuantity: { $sum: "$current_data.itemsDetails.reservedQuantity" },
//         totalBalanceQuantity: { $sum: "$current_data.itemsDetails.balanceQuantity" },
//         itemImage: { $addToSet: "$productData.product_images" },
//       },
//     },
//     {
//       $match: matchStage,
//     },
//     {
//       $project: {
//         _id: 0,
//         itemName: "$_id.itemName",
//         category: "$_id.category",
//         sku: "$_id.sku",
//         hsnCode: "$_id.hsnCode",
//         totalAvailableQuantity: 1,
//         totalResevedQuantity: 1,
//         totalBalanceQuantity: 1,
//         itemImage: 1,
//       },
//     },
//     {
//       $sort: {
//         [sortField]: sortOrder,
//       },
//     },
//     {
//       $skip: (page - 1) * 10,
//     },
//     {
//       $limit: 10,
//     },
//   ]);
//   console.log(result)
//   return res.status(200).json({
//     statusCode: 200,
//     message: "Details Fetched successfully",
//     data: result,
//   });
// });

export const InventoryList = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const searchParam = req.query.searchParam || "";
  const sortField = req.query.sortField || "current_data.itemsDetails.itemName";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const matchStage = {
    "current_data.status": true,
  };

  if (searchParam) {
    matchStage.$or = [
      {
        "current_data.itemsDetails.product_name": {
          $regex: searchParam,
          $options: "i",
        },
      },
      {
        "current_data.itemsDetails.category": {
          $regex: searchParam,
          $options: "i",
        },
      },
      {
        "current_data.itemsDetails.sku": { $regex: searchParam, $options: "i" },
      },
      {
        "current_data.itemsDetails.hsn_code": {
          $regex: searchParam,
          $options: "i",
        },
      },
    ];
  }

  const totalCount = await inventoryModel.aggregate([
    {
      $match: matchStage,
    },
    {
      $count: "total",
    },
  ]);

  const result = await inventoryModel.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "products",
        localField: "current_data.itemsDetails.product_id",
        foreignField: "_id",
        as: "productData",
      },
    },
    {
      $group: {
        _id: {
          itemName: "$current_data.itemsDetails.item_name",
          category: "$current_data.itemsDetails.category",
          sku: "$current_data.itemsDetails.sku",
          hsnCode: "$current_data.itemsDetails.hsn_code",
          status: "$current_data.itemsDetails.status",
          product_id: "$current_data.itemsDetails.product_id",
        },
        totalAvailableQuantity: {
          $sum: "$current_data.itemsDetails.availableQuantity",
        },
        totalReservedQuantity: {
          $sum: "$current_data.itemsDetails.reservedQuantity",
        },
        totalBalanceQuantity: {
          $sum: "$current_data.itemsDetails.balanceQuantity",
        },
        itemImage: { $addToSet: "$productData.current_data.product_images" },
      },
    },
    {
      $unwind: {
        path: "$itemImage",
      },
    },
    {
      $project: {
        _id: 0,
        itemName: "$_id.itemName",
        category: "$_id.category",
        sku: "$_id.sku",
        hsn_code: "$_id.hsnCode",
        product_id: "$_id.product_id",
        totalAvailableQuantity: 1,
        totalReservedQuantity: 1,
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

  const totalPages = Math.ceil(
    totalCount.length > 0 ? totalCount[0].total / 10 : 0
  );

  return res.status(200).json({
    statusCode: 200,
    message: "Details Fetched successfully",
    data: result,
    totalPages: totalPages,
  });
});


export const ViewProductHistory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const page = req.query.page || 1;
  const searchParam = req.query.searchParam || "";
  const sortField = req.query.sortField || "product_Id";
  const sortOrder = req.query.sortOrder || "asc";
  // const {invoiceDate,receiveDate,...data } = req?.body?.filters || {};
  const limit = 10;
  const matchQuery = {
    "current_data.itemsDetails.product_id": new mongoose.Types.ObjectId(id),
    "proposed_changes.status":true,
  };
  const filter = {};

  if (searchParam) {
    matchQuery["$or"] = [
      { purchaseOrderNo: { $regex: searchParam, $options: "i" } },
      {
        "current_data.supplierDetails.firstName": {
          $regex: searchParam,
          $options: "i",
        },
      },
      {
        "current_data.supplierDetails.lastName": {
          $regex: searchParam,
          $options: "i",
        },
      },
      {
        "current_data.supplierDetails.primaryEmailID": {
          $regex: searchParam,
          $options: "i",
        },
      },
      {
        "current_data.supplierDetails.primaryMobileNo": {
          $regex: searchParam,
          $options: "i",
        },
      },
      {
        "current_data.supplierDetails.address.address": {
          $regex: searchParam,
          $options: "i",
        },
      },
      { "current_data.itemsDetails.itemName": { $regex: searchParam, $options: "i" } },
      { "current_data.itemsDetails.category": { $regex: searchParam, $options: "i" } },
      { "current_data.itemsDetails.sku": { $regex: searchParam, $options: "i" } },
    ];
  }
  if (
    req?.body?.filters &&
    req?.body?.filters.invoiceDate &&
    req?.body?.filters.invoiceDate.to &&
    req?.body?.filters.invoiceDate.from
  ) {
    filter["current_data.invoiceDetails.invoiceDate"] = {
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
  console.log(result);
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
      "current_data.itemsDetails.product_Id": productId,
      "current_data.itemsDetails.balanceQuantity": { $gt: 0 },
    })
    .sort({ receivedDate: 1 });
  for (const product of products) {
    const availableQty = product.itemsDetails.availableQuantity;
    const balanceQty = product.itemsDetails.balanceQuantity;
    if (balanceQty !== 0) {
      let newReservedQty = Math.min(availableQty, qty); // Reserve up to qty or the received quantity, whichever is smaller
      newReservedQty += product.itemsDetails.reservedQuantity;
      const newBalanceQty = Math.max(balanceQty - qty, 0); // Ensure balance quantity is not negative
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
