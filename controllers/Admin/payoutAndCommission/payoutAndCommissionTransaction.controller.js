import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import payoutAndCommissionTransModel from "../../../database/schema/payoutAndCommission/payoutsAndCommissionTransaction.schema";
import MarketExecutiveModel from "../../../database/schema/MET/MarketExecutive.schema";
import ApiError from "../../../Utils/ApiError";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import { approvalData } from "../../HelperFunction/approvalFunction";
import adminApprovalFunction from "../../HelperFunction/AdminApprovalFunction";

//approval
// export const addPayout = catchAsync(async (req, res, next) => {
//   const {
//     payouts: { payoutType, transactionId, payoutAmount, tdsPercentage },
//   } = req.body;
//   const { marketExecutiveId } = req.params;
//   let session;

//   try {
//     session = await mongoose.startSession();
//     session.startTransaction();

//     const addPayout = await payoutAndCommissionTransModel.create(
//       [
//         {
//           current_data: {
//             marketExecutiveId,
//             payouts: {
//               payoutType,
//               transactionId,
//               payoutAmount,
//               tdsPercentage,
//               tdsAmount:(payoutAmount/100)*tdsPercentage,
//               amountPaid:payoutAmount - ((payoutAmount/100)*tdsPercentage)
//             },
//           },
//           approver: approvalData(req.user)
//         },
//       ],
//       { session }
//     );

//     const amountPaid = addPayout[0].proposed_changes.payouts.amountPaid;

//     const marketExecutiveBalance = await MarketExecutiveModel.findById(
//       marketExecutiveId
//     );

//     if (!marketExecutiveBalance) {
//       throw new ApiError("Market executive not found", 404);
//     }

//     const newBalance =
//       marketExecutiveBalance.proposed_changes.account_balance - Number(amountPaid);

//     if (newBalance < 0) {
//       return next(new ApiError("Insufficient funds", 400));
//     }
//     await MarketExecutiveModel.updateOne(
//       { _id: marketExecutiveId },
//       {
//         $inc: {
//           "proposed_changes.account_balance": -Number(amountPaid).toFixed(2),
//         },
//         $set: {
//           "proposed_changes.status":false,
//           approver: approvalData(req.user)
//         }
//       },
//       { session }
//     );


//     await session.commitTransaction();
//     await session.endSession();

//     adminApprovalFunction({
//       module: "MarketExecutive",
//       user: req.user,
//       documentId: marketExecutiveId
//     })
//     adminApprovalFunction({
//       module: "payoutAndCommissionTransaction",
//       user: req.user,
//       documentId: addPayout[0]._id
//     })

//     return res.status(201).json({
//       statusCode: 201,
//       status: "created",
//       data: {
//         payout: addPayout,
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     next(error);
//   }
// });

// export const getPayoutAndCommissionTrans = catchAsync(
//   async (req, res, next) => {
//     const { string, boolean, numbers } = req?.body?.searchFields || {};

//     const {
//       type,
//       page = 1,
//       limit = 10,
//       sortBy = "createdAt",
//       sort = "desc",
//     } = req.query;

//     const { marketExecutiveId } = req.params;



//     const search = req.query.search || "";

//     let searchQuery = {};
//     if (search != "" && req?.body?.searchFields) {
//       const searchdata = dynamicSearch(search, boolean, numbers, string);
//       if (searchdata?.length == 0) {
//         return res.status(404).json({
//           statusCode: 404,
//           status: "failed",
//           data: {
//             Transaction: [],
//           },
//           message: "Results Not Found",
//         });
//       }
//       searchQuery = searchdata;
//     }

//     const { to, from, ...data } = req?.body?.filters || {};
//     const matchQuery = data || {};

//     if (to && from) {
//       matchQuery["salesOrderDate"] = {
//         $gte: new Date(from),
//         $lte: new Date(to),
//       };
//     }

//     const getTransaction = await payoutAndCommissionTransModel.aggregate([
//       {
//         $match: {
//           "current_data.marketExecutiveId": new mongoose.Types.ObjectId(marketExecutiveId),
//           ...matchQuery,
//           ...searchQuery,
//         },
//       },
//       {
//         $sort: {
//           [sortBy]: sort == "desc" ? -1 : 1,
//         },
//       },
//       {
//         $limit: Number(limit),
//       },
//       {
//         $skip: Number(page) * limit - Number(limit),
//       },
//     ]);

//     const totalDocuments = await payoutAndCommissionTransModel.countDocuments({
//       "current_data.marketExecutiveId": new mongoose.Types.ObjectId(marketExecutiveId),
//       ...matchQuery,
//       ...searchQuery,
//     });

//     const totalPages = Math.ceil(totalDocuments / limit);

//     return res.status(200).json({
//       statusCode: 200,
//       status: "success",
//       totalPages: totalPages,
//       data: {
//         Transaction: getTransaction,
//       },
//     });
//   }
// );


export const addPayout = catchAsync(async (req, res, next) => {
  const {
    payouts: { payoutType, transactionId, payoutAmount, tdsPercentage = 10, payoutDate },
  } = req.body;
  const { marketExecutiveId } = req.params;
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const marketExecutiveBalance = await MarketExecutiveModel.findById(
      marketExecutiveId
    );

    if (!marketExecutiveBalance) {
      throw new ApiError("Market executive not found", 404);
    }

    const addPayout = await payoutAndCommissionTransModel.create(
      [
        {
          marketExecutiveId,
          payouts: {
            payoutType,
            transactionId,
            payoutAmount,
            payoutDate: new Date(payoutDate).setUTCHours(0, 0, 0, 0),
            tdsPercentage,
            tdsAmount: ((payoutAmount / 100) * tdsPercentage).toFixed(2),
            amountPaid: (payoutAmount - ((payoutAmount / 100) * tdsPercentage)).toFixed(2)
          },
        },
      ],
      { session }
    );

    const amountPaid = Number(addPayout[0].payouts.amountPaid).toFixed(2);

    const newBalance = Number(marketExecutiveBalance?.account_balance).toFixed(2) - Number(amountPaid).toFixed(2);

    if (newBalance < 0) {
      return next(new ApiError("Insufficient funds", 400));
    }
    await MarketExecutiveModel.updateOne(
      { _id: marketExecutiveId },
      {
        $inc: {
          "account_balance": (-Number(amountPaid)).toFixed(2),
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
      page = 1,
      limit = 10,
      sortBy = "created_at",
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

    const { range = null, ...data } = req?.body?.filters || {};
    
    const matchQuery = data || {};

    if (range) {
      const rangeData = JSON.parse(JSON.stringify(range)?.replace(/from/g, "$gte")?.replace(/to/g, "$lte"));
      matchQuery.$or = [{}];
      const commission = [];
      const payouts = [];

      for (let i in rangeData) {
        if (i.startsWith("commission")) {
          commission.push({
            [i]: rangeData[i]
          })
        }
        if (i.startsWith("payouts")) {
          payouts.push({
            [i]: rangeData[i]
          })
        }
      }
      if (commission.length > 0) matchQuery.$or.push({
        $and: commission
      });
      if (payouts.length > 0) matchQuery.$or.push({
        $and: payouts
      });
    }
    // res.send(matchQuery)

    // const getTransaction = await payoutAndCommissionTransModel.aggregate([
    //   {
    //     $match: {
    //       marketExecutiveId: new mongoose.Types.ObjectId(marketExecutiveId),
    //       ...matchQuery,
    //       ...searchQuery,
    //     },
    //   },
    //   {
    //     $sort: {
    //       [sortBy]: sort === "desc" ? -1 : 1,
    //     },
    //   },
    //   {
    //     $skip: (Number(page) - 1) * Number(limit),
    //   },
    //   {
    //     $limit: Number(limit),
    //   },
    // ]);


    const getTransaction = await payoutAndCommissionTransModel.find({
      marketExecutiveId: new mongoose.Types.ObjectId(marketExecutiveId),
      ...matchQuery,
      ...searchQuery,
    })
      .skip((Number(page) - 1) * Number(limit))
      .limit(limit)
      .sort({ [sortBy]: sort })
      .exec();

    const getTotals = await payoutAndCommissionTransModel.aggregate([
      {
        $match: {
          marketExecutiveId: new mongoose.Types.ObjectId(marketExecutiveId),
          ...matchQuery,
          ...searchQuery,
        },
      },
      {
        $group: {
          _id: "$marketExecutiveId",
          commission: {
            $sum: "$commission.commissionAmount"
          },
          payouts: {
            $sum: "$payouts.amountPaid"
          }
        }
      }
    ])

    const totalDocuments = await payoutAndCommissionTransModel.countDocuments({
      marketExecutiveId: new mongoose.Types.ObjectId(marketExecutiveId),
      ...matchQuery,
      ...searchQuery,
    });

    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      length: getTransaction.length,
      totalPages: totalPages,
      data: {
        Transaction: getTransaction,
      },
      totals: getTotals
    });
  }
);