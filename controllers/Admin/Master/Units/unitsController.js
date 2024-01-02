import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import unitModel from "../../../../database/schema/Master/Units/unit.schema";

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
  const { string, boolean, numbers } = req?.body?.searchFields;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";

  let searchQuery = {};
  if (search != "") {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        data: {
          units: [],
          // totalPages: 1,
          // currentPage: 1,
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  const totalUnits = await unitModel.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalUnits / limit);

  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
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