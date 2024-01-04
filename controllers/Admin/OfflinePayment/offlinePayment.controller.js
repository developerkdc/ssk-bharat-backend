import catchAsync from "../../../Utils/catchAsync";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import offlinePaymentModel from "../../../database/schema/OfflinePayment/offlinePayment.schema";

export const getOfflinePaymentDetails = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};
  const search = req.query.search || "";
  const {
    page = 1,
    limit = 10,
    sortBy = "salesOrderNo",
    sort = "desc",
  } = req.query;

  const skip = (page - 1) * limit;

  //filters
  const { to, from, ...data } = req?.body?.filters || {};
  const matchQuery = data || {};

  //search
  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "failed",
        data: {
          data: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  const totalDocuments = await offlinePaymentModel.countDocuments({
    ...matchQuery,
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocuments / limit);

  const allOfflinePayment = await offlinePaymentModel
    .find({
      ...matchQuery,
      ...searchQuery,
    })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sort })
    .exec();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: allOfflinePayment,
    totalPages: totalPages,
    message: "All Offline Payment Data",
  });
});

export const addOfflinePayment = catchAsync(async (req, res, next) => {
  const {
    paymentType,
    transactionId,
    upiId,
    followUpDate,
    remark,
    paymentAmount,
  } = req.body;
  const addPayment = await offlinePaymentModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        "proposed_changes.payments": {
          paymentType,
          transactionId,
          upiId,
          followUpDate,
          paymentAmount: paymentAmount,
          remark,
        },
      },
      $inc: {
        "proposed_changes.recievedAmount": paymentAmount,
        "proposed_changes.balanceAmount": -paymentAmount,
      },
      $set: {
        "proposed_changes.paymentStatus": "partailly paid",
      },
    },
    { new: true }
  );

  return res.status(201).json({
    statusCode: 201,
    status: true,
    data: addPayment,
    message: "payment was added",
  });
});

export const addFollowupAndRemark = catchAsync(async (req, res, next) => {
  const { followUpDate, remark } = req.body;
  const addFollowupAndRemark = await offlinePaymentModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        "proposed_changes.followUp": {
          followUpDate,
          remark,
        },
      },
    },
    { new: true }
  );

  return res.status(201).json({
    statusCode: 201,
    status: true,
    data: addFollowupAndRemark,
    message: "Followup And Remark was added",
  });
});
