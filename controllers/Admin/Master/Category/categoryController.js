import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import categoryModel from "../../../../database/schema/Master/Category/category.schema";
import { approvalData } from "../../../HelperFunction/approvalFunction";
import { createdByFunction } from "../../../HelperFunction/createdByfunction";
import adminApprovalFunction from "../../../HelperFunction/AdminApprovalFunction";
import mongoose from "mongoose";

export const createCategory = catchAsync(async (req, res, next) => {
  const user = req.user;
  const relativeImagePath = req.file ? req.file.path : null;
  const category = await categoryModel.create({
    current_data: {
      ...req.body,
      category_image: relativeImagePath,
      created_by: createdByFunction(user),
    },
    approver: approvalData(user),
  });

  if (!category) return new ApiError("Error while Creating", 400);

  adminApprovalFunction({
    module: "category",
    user: user,
    documentId: category._id,
  });

  if (category) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: category,
      message: "Category Created",
    });
  }
});

export const getCategory = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const sortBy = req.query.sortBy || "created_at";
  const search = req.query.search || "";
  const portal = req.query.portal || "";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        data: {
          category: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  const baseQuery = {
    ...searchQuery,
    "current_data.status": true,
  };

  const totalCategory = await categoryModel.countDocuments(baseQuery);

  const totalPages = Math.ceil(totalCategory / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const category = await categoryModel
    .find(portal!="" ? {...baseQuery, [portal]: true } : baseQuery)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (category) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        category: category,
        totalPages: totalPages,
        currentPage: validPage,
        imagePath: `${process.env.IMAGE_PATH}/admin/category/`,
      },
      message: "All Categories",
    });
  }
});

export const getCategoryList = catchAsync(async (req, res, next) => {
  const category = await categoryModel.aggregate([
    {
      $match: { "current_data.status": true, "current_data.isActive": true },
    },
    {
      $project: {
        _id: 1,
        category_name: "$current_data.category_name",
      },
    },
  ]);

  if (category) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: category,
      message: "All Category List",
    });
  }
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  let relativeImagePath;
  // relativeImagePath = oldCategory.category_image;
  if (req.file) {
    // fs.unlinkSync(`./uploads/admin/category/${oldCategory.category_image}`);
    relativeImagePath = req.file.path;
  }

  const updatedCategory = await categoryModel.findByIdAndUpdate(
    id,
    {
      $set: {
        "proposed_changes.category_name": req?.body?.category_name,
        "proposed_changes.category_image": relativeImagePath,
        "proposed_changes.status": false,
        "proposed_changes.isActive": req?.body?.isActive,
        "proposed_changes.show_in_website": req?.body?.show_in_website,
        "proposed_changes.show_in_retailer": req?.body?.show_in_retailer,
        "proposed_changes.show_in_offline_store":
          req?.body?.show_in_offline_store,
        updated_at: Date.now(),
        approver: approvalData(user),
      },
    },
    { new: true }
  );

  if (!updatedCategory) return new ApiError("Error while updating", 400);

  adminApprovalFunction({
    module: "category",
    user: user,
    documentId: id,
  });

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: updatedCategory,
    message: "Category Updated",
  });
});


export const CategoryLogs = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10; // Number of items per page
  const totalRoles = await mongoose.model("categorylogs").countDocuments({});

  const totalPages = Math.ceil(totalRoles / perPage);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * perPage;

  const log = await mongoose.model("categorylogs").find({}).skip(skip).limit(perPage);

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: log,
    totalPages: totalPages,
    message: "Logs fetched successfully",
  });
});