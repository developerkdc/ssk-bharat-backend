import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import tdsModel from "../../../../database/schema/Master/TDS/tds.schema";

export const createTds = catchAsync(async (req, res, next) => {
  const tds = await tdsModel.create(req.body);
  if (tds) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: tds,
      message: "GST Created",
    });
  }
});

export const getTDS = catchAsync(async (req, res, next) => {
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
          tds: [],
          // totalPages: 1,
          // currentPage: 1,
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }
  const totalGst = await tdsModel.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalGst / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const tds = await tdsModel
    .find(searchQuery)
    .sort({ tds_percentage: sortDirection })
    .skip(skip)
    .limit(limit);

  if (tds) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: {
        tds: tds,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All TDS",
    });
  }
});

export const getTDSList = catchAsync(async (req, res, next) => {
  const tds = await tdsModel.aggregate([
    {
      $project: {
        _id: 1,
        tds_percentage: 1,
      },
    },
  ]);
  if (tds) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: tds,
      message: "All TDS List",
    });
  }
});

export const updateTds = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tds = await tdsModel.findById(id);
  if (!tds) {
    return next(new ApiError("TDS Not Found", 404));
  }
  const updatedtds = await tdsModel.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatedtds,
    message: "TDS Updated",
  });
});
