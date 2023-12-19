import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import categoryModel from "../../database/schema/category.schema";
import { unlink } from "fs/promises";

export const createCategory = catchAsync(async (req, res, next) => {
  // Get the relative path of the uploaded image
  console.log(req.file)
  const relativeImagePath = req.file ? req.file.filename : null;
  const category = await categoryModel.create({...req.body, category_image: relativeImagePath});
  if (category) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      image_path:`${process.env.IMAGE_PATH}/admin/category/${category.category_image}`,
      data: category,
      message: "Category Created",
    });
  }
});

export const getCategory = catchAsync(async (req, res, next) => {
  console.log("iuhrgiuh");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const searchQuery = search
    ? { category_name: { $regex: search, $options: "i" } }
    : {};
  const totalRoles = await categoryModel.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalRoles / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;

  const category = await categoryModel
    .find(searchQuery)
    .sort({ category_name: sortDirection })
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

  // Step 1: Retrieve the old category
  const oldCategory = await categoryModel.findById(id);

  if (!oldCategory) {
    return next(new ApiError("Category Not Found", 404));
  }
console.log(req.file,"file")
console.log(req.body,"body")
console.log(oldCategory,"old")
  // Step 2: Delete the previous image file if it exists
  if (oldCategory.category_image) {
    try {
      await unlink(oldCategory.category_image);
    } catch (error) {
      console.error("Error deleting previous image:", error);
    }
  }

  // Step 3: Update the category with new information
  const updatedCategory = await categoryModel.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );

  // Respond with the updated category
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatedCategory,
    message: "Category Updated",
  });
});
