import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
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
  const { type = "order" } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const totalFaq = await FaqModel.countDocuments();
  const totalPages = Math.ceil(totalFaq / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const faqs = await FaqModel.find({ module_type: type })
    .skip(skip)
    .limit(limit);
  if (faqs) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        faqs: faqs,
        totalPages: totalPages,
      },
      message: `All ${type} Faqs`,
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
