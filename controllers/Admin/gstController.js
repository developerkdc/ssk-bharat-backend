import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import gstModel from "../../database/schema/gst.schema";

export const createGst = catchAsync(async (req, res, next) => {
  const gst = await gstModel.create(req.body);
  if (gst) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: gst,
      message: "GST Created",
    });
  }
});

export const getGST = catchAsync(async (req, res, next) => {
  
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const search = req.query.search || "";
    const searchQuery = search
      ? { gst_percentage: parseInt(search) }
      : {};
    const totalGst = await gstModel.countDocuments(searchQuery);
    if(!totalGst) throw new Error (new ApiError("No Data",404))
    const totalPages = Math.ceil(totalGst / limit);
    const validPage = Math.min(Math.max(page, 1), totalPages);
    const skip = (validPage - 1) * limit;
  
    const gst = await gstModel
      .find(searchQuery)
      .sort({ gst_percentage: sortDirection })
      .skip(skip)
      .limit(limit);
  
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

export const getGstList = catchAsync(async (req, res, next) => {
  const gst = await gstModel.aggregate([
    {
      $project: {
        _id: 1,
        gst_percentage: 1
      },
    },
  ]);
  if (gst) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: gst,
      message: "All GST List",
    });
  }
});

export const updateGst = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const gst = await gstModel.findById(id);
  if (!gst) {
    return next(new ApiError("GST Not Found", 404));
  }
  const updatedGst = await gstModel.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatedGst,
    message: "GST Updated",
  });
});
