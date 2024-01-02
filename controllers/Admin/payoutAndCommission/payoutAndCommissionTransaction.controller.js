import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import payoutAndCommissionTransModel from "../../../database/schema/payoutAndCommission/payoutsAndCommissionTransaction.schema";
import MarketExecutiveModel from "../../../database/schema/MET/MarketExecutive.schema";
import ApiError from "../../../Utils/ApiError";

export const addPayout = catchAsync(async (req, res, next) => {
  const {
    payouts: { payoutType, transactionId, payoutAmount, tdsPercentage },
  } = req.body;
  const { marketExecutiveId } = req.params;
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const addPayout = await payoutAndCommissionTransModel.create(
      [
        {
          marketExecutiveId,
          payouts: {
            payoutType,
            transactionId,
            payoutAmount,
            tdsPercentage,
          },
        },
      ],
      { session }
    );

    const amountPaid = addPayout[0].payouts.amountPaid;

    const marketExecutiveBalance = await MarketExecutiveModel.findById(
      marketExecutiveId
    );

    if (!marketExecutiveBalance) {
      throw new ApiError("Market executive not found", 404);
    }

    const newBalance =
      marketExecutiveBalance.account_balance - Number(amountPaid);

    if (newBalance < 0) {
      throw new ApiError("Insufficient funds", 400);
    }

    await MarketExecutiveModel.updateOne(
      { _id: marketExecutiveId },
      {
        $inc: {
          account_balance: -Number(amountPaid).toFixed(2),
        },
      },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();

    return res.status(201).json({
      statusCode: 201,
      status: "created",
      data: {
        payout: addPayout,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
});

export const getPayoutAndCommissionTrans = catchAsync(
  async (req, res, next) => {
    const { string, boolean, numbers } = req?.body?.searchFields || {};

    const {
      type,
      page=1,
      limit = 10,
      sortBy = "createdAt",
      sort = "desc",
    } = req.query;

    const { marketExecutiveId } = req.params;



    const search = req.query.search || "";

    let searchQuery = {};
    if (search != "" && req?.body?.searchFields) {
      const searchdata = dynamicSearch(search, boolean, numbers, string);
      if (searchdata?.length == 0) {
        return res.status(404).json({
          statusCode: 404,
          status: "failed",
          data: {
            Transaction: [],
          },
          message: "Results Not Found",
        });
      }
      searchQuery = searchdata;
    }

    const { to, from, ...data } = req?.body?.filters || {};
    const matchQuery = data || {};

    if (to && from) {
      matchQuery["salesOrderDate"] = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const getTransaction = await payoutAndCommissionTransModel.aggregate([
      {
        $match: {
          marketExecutiveId: new mongoose.Types.ObjectId(marketExecutiveId),
          ...matchQuery,
          ...searchQuery,
        },
      },
      {
        $sort: {
          [sortBy]: sort == "desc" ? -1 :1,
        },
      },
      {
        $limit: Number(limit),
      },
      {
        $skip: Number(page) * limit - Number(limit),
      },
    ]);

    const totalDocuments = await payoutAndCommissionTransModel.countDocuments({
      ...matchQuery,
      ...searchQuery,
    });

    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      totalPages: totalPages,
      data: {
        Transaction: getTransaction,
      },
    });
  }
);
