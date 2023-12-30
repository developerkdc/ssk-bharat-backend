import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import paymentTermDaysModel from "../../database/schema/paymentTermDays.schema";

export const createTermDays = catchAsync(async (req, res, next) => {
  const termDays = await paymentTermDaysModel.create(req.body);
  if (termDays) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: termDays,
      message: "Payment Term Days Created",
    });
  }
});

export const getPaymentTermDays = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const searchQuery = search ? {
    $expr: {
      $regexMatch: {
        input: { $toString: "$payment_term_days" },
        regex: new RegExp(search.toString()),
        options: "i",
      },
    },
  } : {};
  const totalTerm = await paymentTermDaysModel.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalTerm / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const termDays = await paymentTermDaysModel
    .find(searchQuery)
    .sort({ payment_term_days: sortDirection })
    .skip(skip)
    .limit(limit);

  if (termDays) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: {
        payment_term_days: termDays,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All Payment Term Days",
    });
  }
});

export const getPaymentTermList = catchAsync(async (req, res, next) => {
  const termDays = await paymentTermDaysModel.aggregate([
    {
      $project: {
        _id: 1,
        payment_term_days: 1,
      },
    },
  ]);
  if (termDays) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: termDays,
      message: "All Payment Term List",
    });
  }
});

export const updatePaymentTerm = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedTermDays = await paymentTermDaysModel.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );
  if (!updatedTermDays) {
    return next(new ApiError("Payment Term Days Not Found", 404));
  }
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatedTermDays,
    message: "Payment Term Days Updated",
  });
});
