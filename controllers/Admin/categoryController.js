import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import { dynamicSearch } from "../../Utils/dynamicSearch";
import categoryModel from "../../database/schema/category.schema";
import fs from "fs";

export const createCategory = catchAsync(async (req, res, next) => {
  // Get the relative path of the uploaded image
  console.log(req.file);
  const relativeImagePath = req.file ? req.file.filename : null;
  const category = await categoryModel.create({
    ...req.body,
    category_image: relativeImagePath,
  });
  if (category) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: category,
      message: "Category Created",
    });
  }
});

export const getCategory = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const sortBy = req.query.sortBy || "category_name";
  const search = req.query.search || "";


  let searchQuery = {};
  if (search != "") {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
      if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        data: {
          category: [],
          // totalPages: 1,
          // currentPage: 1,
        },
        message: "Results Not Found",
      });
    }
    searchQuery=searchdata
  }

  const totalCategory = await categoryModel.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalCategory / limit);

  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;

  const category = await categoryModel
    .find(searchQuery)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (category) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
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
  console.log("iuhrgiuh");
  const category = await categoryModel.aggregate([
    {
      $project: {
        _id: 1,
        category_name: 1,
      },
    },
  ]);

  if (category) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: category,
      message: "All Category List",
    });
  }
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let relativeImagePath;
  // Step 1: Retrieve the old category
  const oldCategory = await categoryModel.findById(id);

  if (!oldCategory) {
    return next(new ApiError("Category Not Found", 404));
  }

  relativeImagePath = oldCategory.category_image;
  if (req.file) {
    fs.unlinkSync(`./uploads/admin/category/${oldCategory.category_image}`);
    console.log("File deleted successfully");
    relativeImagePath = req.file.filename;
  }
  const updatedCategory = await categoryModel.findByIdAndUpdate(
    id,
    { ...req.body, category_image: relativeImagePath, updated_at: Date.now() },
    { new: true }
  );
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatedCategory,
    message: "Category Updated",
  });
});
