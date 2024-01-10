import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import productModel from "../../../../database/schema/Master/Products/product.schema";
import fs from "fs";
import { approvalData } from "../../../HelperFunction/approvalFunction";
import { createdByFunction } from "../../../HelperFunction/createdByfunction";

export const createProduct = catchAsync(async (req, res, next) => {
  // Get the relative path of the uploaded image
  const user = req.user;
  let relativeImagePath = [];
  for (let file of req.files) {
    relativeImagePath.push(file.filename);
  }
  const prices = {
    retailer_sales_price: req?.body?.retailer_sales_price || 0,
    website_sales_price: req?.body?.website_sales_price || 0,
    offline_store_sales_price: req?.body?.offline_store_sales_price || 0,
  };
  const product = await productModel.create({
    current_data: {
      ...req.body,
      prices: prices,
      product_images: relativeImagePath,
      created_by: createdByFunction(user),
    },
    approver: approvalData(user),
  });
  if (product) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: product,
      message: "Product Created",
    });
  }
});

export const getProducts = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "success",
        data: {
          tds: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }
  const totalProduct = await productModel.countDocuments({
    ...searchQuery,
    "current_data.status": true,
  });

  const totalPages = Math.ceil(totalProduct / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const sortField = req?.query?.sortBy || "created_at";
  const product = await productModel
    .find({ ...searchQuery, "current_data.status": true })
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit)
    .populate([
      {
        path: "current_data.category",
        select: "_id current_data.category_name",
      },
      {
        path: "current_data.unit",
        select: "_id current_data.unit_name current_data.unit_symbol",
      },
    ]);

  if (product) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        product: product,
        totalPages: totalPages,
        currentPage: validPage,
        imagePath: `${process.env.IMAGE_PATH}/admin/products/`,
      },
      message: "All Products",
    });
  }
});

export const getProductList = catchAsync(async (req, res, next) => {
  const product = await productModel.aggregate([
    {
      $match: { "current_data.status": true, "current_data.isActive": true },
    },
    {
      $project: {
        _id: 1,
        "current_data.product_name": 1,
      },
    },
  ]);

  if (product) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: product,
      message: "All Product List",
    });
  }
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const { product_images, ...data } = req.body;
  const updatedProduct = await productModel.findByIdAndUpdate(
    id,
    {
      "proposed_changes.category": data?.category, // Replace with a valid category ObjectId
      "proposed_changes.product_name": data?.product_name,
      "proposed_changes.sku": data?.sku,
      "proposed_changes.short_description": data?.short_description,
      "proposed_changes.long_description": data?.long_description,
      "proposed_changes.hsn_code": data?.hsn_code,
      "proposed_changes.gst": data?.gst, // Replace with a valid GST ObjectId
      "proposed_changes.status": data?.status,
      "proposed_changes.show_in_website": data?.show_in_website,
      "proposed_changes.show_in_retailer": data?.show_in_retailer,
      "proposed_changes.show_in_offline_store": data?.show_in_offline_store,
      "proposed_changes.prices": data?.prices,
      "proposed_changes.mrp": data?.mrp,
      "proposed_changes.item_weight": data?.item_weight,
      "proposed_changes.unit": data?.unit, // Replace with a valid unit ObjectId
      "proposed_changes.isActive": data?.isActive,
      approver: approvalData(user),
      updated_at: Date.now(),
    },
    { new: true }
  );
  

  return res.status(200).json({
    statusCode: 200,
    status: "updated",
    data: updatedProduct,
    message: "Product Updated",
  });
});

export const updateProductImage = catchAsync(async (req, res, next) => {
  const { id, imageName } = req.params;
  const user = req.user;

  const updatedProductImage = await productModel.updateOne(
    { _id: id, product_images: imageName },
    {
      $set: {
        "proposed_changes.product_images.$[e]": req.file.filename,
        approver: approvalData(user),
        updated_at: Date.now(),
      },
    },
    {
      arrayFilters: [{ e: imageName }],
    }
  );

  // if (
  //   updatedProductImage.acknowledged &&
  //   updatedProductImage.modifiedCount > 0
  // ) {
  //   if (fs.existsSync(`./uploads/admin/products/${imageName}`)) {
  //     fs.unlinkSync(`./uploads/admin/products/${imageName}`);
  //   }
  // }

  return res.status(200).json({
    statusCode: 200,
    status: "updated",
    data: updatedProductImage,
    message: "Product images Updated",
  });
});

export const deleteProductImage = catchAsync(async (req, res, next) => {
  const { id, imageName } = req.params;
  const deletedProductImage = await productModel.updateOne(
    { _id: id, product_images: imageName },
    {
      $pull: {
        product_images: imageName,
      },
    }
  );

  if (
    deletedProductImage.acknowledged &&
    deletedProductImage.modifiedCount > 0
  ) {
    if (fs.existsSync(`./uploads/admin/products/${imageName}`)) {
      fs.unlinkSync(`./uploads/admin/products/${imageName}`);
    }
  }

  return res.status(200).json({
    statusCode: 200,
    status: "deleted",
    data: deletedProductImage,
    message: "Product images deleted",
  });
});
