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

export const sampleList = catchAsync(async(req,res)=>{
    const samplesList = await sampleOut.find();
    return res.status(200).json({
      statusCode: 200,
      data: samplesList,
      message: "Success",
    });
})