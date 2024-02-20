import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import productModel from "../../../database/schema/Master/Products/product.schema";
import sampleOut from "../../../database/schema/Samples/sampleOut.schema";

export const outwardSample = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const sample = await sampleOut.create(req.body);

  return res.status(201).json({
    statusCode: 201,
    data: sample,
    message: "success",
  });
});

export const getItemdetails = catchAsync(async (req, res, next) => {
  let itemId = req.params.itemid;
  let item = await productModel
    .findById(itemId)
    .populate("category")
    .populate("unit");
  return res.status(200).json({
    statusCode: 200,
    data: item,
    message: "success",
  });
});

export const sampleList = catchAsync(async (req, res) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};
  const search = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const sortField = req?.query?.sortBy || "_id";

  const { to, from, ...data } = req?.body?.filters || {};
  const matchQuery = data || {};
 

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        data: {
          purchaseOrder: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }
  
  const samplesList = await sampleOut
    .find({...matchQuery,...searchQuery})
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit)

  const totalDocuments = await sampleOut.countDocuments({...matchQuery,...searchQuery});
  const totalPages = Math.ceil(totalDocuments / limit);

  return res.status(200).json({
    statusCode: 200,
    data: samplesList,
    totalPages:totalPages,
    status:"success",
    message: "Fetch Sample Data",
   
  });
});

export const getChallanDetails = catchAsync(async (req, res) => {
  const challanNo = req.query.challanno;
  const samplesList = await sampleOut.findOne({ deliveryChallanNo: challanNo });

  return res.status(200).json({
    statusCode: 200,
    data: samplesList,
    message: "Sucess",
  });
});
