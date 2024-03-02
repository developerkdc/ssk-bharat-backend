import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import FaqModel from "../../../database/schema/FAQs/faq.schema";
import { createdByFunction } from "../../HelperFunction/createdByfunction";

export const createFaq = catchAsync(async (req, res, next) => {
  const user = req.user;

  const faq = await FaqModel.create({
    ...req.body,
    created_by: createdByFunction(user),
  });

  if (!faq) return new ApiError("Error while Creating", 400);

  if (faq) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: faq,
      message: "FAQ Created",
    });
  }
});

export const editFaq = catchAsync(async (req, res, next) => {
  const faq = await FaqModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...req.body,
        updated_at: Date.now(),
      },
    },
    { new: true, runValidators: true }
  );
  if (!faq) {
    return next(new ApiError("error while updating", 400));
  }
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: faq,
    message: "FAQ Updated",
  });
});

export const getFaqs = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const sortField = req.query.sortBy || "created_at";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "failed",
        data: {
          faqs: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  const totalFaq = await FaqModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalFaq / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const faqs = await FaqModel
    .find({
      ...searchQuery,
    })
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  if (faqs) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        faqs: faqs,
        totalPages: totalPages,
        currentPage: validPage,
      },
      message: "All Faqs",
    });
  }
});

export const deleteFaq = catchAsync(async (req, res, next) => {
  const faq = await FaqModel.findByIdAndDelete(req.params.id);
  if (!faq) {
    return next(new ApiError("error while deleting", 400));
  }
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: faq,
    message: "FAQ Deleted",
  });
});
