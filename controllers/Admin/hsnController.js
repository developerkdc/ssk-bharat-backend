import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import hsnCodeModel from "../../database/schema/hsnCode.schema";

export const createHSN = catchAsync(async (req, res, next) => {
  const hsnCode = await hsnCodeModel.create(req.body);
  if (hsnCode) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: hsnCode,
      message: "HSN Code Created",
    });
  }
});

export const getHSNCode = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const searchQuery = search
    ? {
        $or: [
          { gst_percentage: parseInt(search) },
          { hsn_code: parseInt(search) },
        ],
      }
    : {};
  const totalGst = await hsnCodeModel.countDocuments(searchQuery);
  if (!totalGst) throw new Error(new ApiError("No Data", 404));
  const totalPages = Math.ceil(totalGst / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;
  const sortField =
    req.query.sortBy === "gst_percentage" ? "gst_percentage" : "hsn_code";

  const gst = await hsnCodeModel
    .find(searchQuery)
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit)
    .populate([{
        path:"gst_percentage",select:"_id gst_percentage"
    }])

  if (gst) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: {
        gst: gst,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All GST",
    });
  }
});

export const getHSNCodeList = catchAsync(async (req, res, next) => {
  const hsnCode = await hsnCodeModel.aggregate([
    {
      $project: {
        _id: 1,
        hsn_code:1,
        gst_percentage: 1
      },
    },
  ]);
  if (hsnCode) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: hsnCode,
      message: "All HSN Code List",
    });
  }
});

export const updateHsnCode = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const hsnCode = await hsnCodeModel.findById(id);
  if (!hsnCode) {
    return next(new ApiError("HSN Code Not Found", 404));
  }
  const updatedHsnCode = await hsnCodeModel.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatedHsnCode,
    message: "HSN Code Updated",
  });
});
