import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import unitModel from "../../database/schema/unit.schema";

export const createUnit = catchAsync(async (req, res, next) => {
  const unit = await unitModel.create(req.body);
  if (unit) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: unit,
      message: "Unit Created",
    });
  }
});

export const getUnits = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const searchQuery = search
    ? {
        $or: [
          { unit_name: { $regex: search, $options: "i" } },
          { unit_symbol: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const totalUnits = await unitModel.countDocuments(searchQuery);
  if (!totalUnits) throw new Error(new ApiError("No Data", 404));
  const totalPages = Math.ceil(totalUnits / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;
  const sortField =
    req.query.sortBy === "unit_symbol" ? "unit_symbol" : "unit_name";

  const units = await unitModel
    .find(searchQuery)
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (units) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: {
        units: units,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All Categories",
    });
  }
});

export const getUnitList = catchAsync(async (req, res, next) => {
  console.log("iuhrgiuh");
  const unit = await unitModel.aggregate([
    {
      $project: {
        _id: 1,
        unit_name: 1,
        unit_symbol: 1,
      },
    },
  ]);

  if (unit) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: unit,
      message: "All unit List",
    });
  }
});

export const updateUnit = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const unit = await unitModel.findById(id);

  if (!unit) {
    return next(new ApiError("Unit Not Found", 404));
  }
  const updatedUnit = await unitModel.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatedUnit,
    message: "Unit Updated",
  });
});
