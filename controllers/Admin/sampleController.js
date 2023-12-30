import mongoose from "mongoose";
import catchAsync from "../../Utils/catchAsync";
import productModel from "../../database/schema/product.schema";
import sampleOut from "../../database/schema/sampleOut.schema";



export const outwardSample = catchAsync(async(req,res,next)=>{

    const sample = await sampleOut.create(req.body);

    return res.status(201).json({
        statusCode:201,
        data:sample,
        message:"success"
    })
})

export const getItemdetails = catchAsync(async(req,res,next)=>{
    let itemId= req.params.itemid;
    let item = await productModel
      .findById(itemId)
      .populate("category")
      .populate("unit");
    return res.status(200).json({
        statusCode:200,
        data:item,
        message:"success"
    })
})

export const sampleList = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit =  10;
  const skip = (page - 1) * limit;
  const sortField = req.query.sortField || "_id";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const sortOptions = { [sortField]: sortOrder };
  const filter = {};
  if (req.query.deliveryChallanNo) {
    filter.deliveryChallanNo = req.query.deliveryChallanNo;
  }
  if (req.query.itemName) {
    filter["items.itemName"] = req.query.itemName;
  }
  if (req.query.personName) {
    filter.personName = req.query.personName;
  }
  if (req.query.companyName) {
    filter["address.companyName"] = req.query.companyName;
  }
  if (req.query.category) {
    filter["address.category"] = req.query.category;
  }

  const search = req.query.search;
  if (search) {
     const searchRegex = new RegExp(search, "i");
     filter.$or = [
       { deliveryChallanNo: searchRegex },
       { "items.itemName": searchRegex },
       { "items.category": searchRegex },
       { "items.sku": searchRegex },
       { "items.hsnCode": searchRegex },
       { "items.gstpercentage": searchRegex },
       { personName: searchRegex },
       { "contactDetails.email": searchRegex },
       { "contactDetails.mobileNo": searchRegex },
       { companyName: searchRegex },
       { gstNo: searchRegex },
       { "address.address": searchRegex },
       { "address.location": searchRegex },
       { "address.area": searchRegex },
       { "address.city": searchRegex },
       { "address.taluka": searchRegex },
       { "address.district": searchRegex },
       { "address.state": searchRegex },
       { "address.country": searchRegex },
       { "address.pincode": searchRegex },
     ];
  }
  const samplesList = await sampleOut
    .find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalDocuments = await sampleOut.countDocuments(filter);

  return res.status(200).json({
    statusCode: 200,
    data: samplesList,
    message: "Success",
    meta: {
      page,
      limit,
      totalDocuments,
    },
  });
});

export const getChallanDetails = catchAsync(async(req,res)=>{
    const challanNo = req.query.challanno;
    const samplesList = await sampleOut.findOne({ deliveryChallanNo: challanNo });

    return res.status(200).json({
        statusCode : 200 ,
        data : samplesList ,
        message : 'Sucess'

    })
})