import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import payoutAndCommissionTransModel from "../../../database/schema/payoutAndCommission/payoutsAndCommissionTransaction.schema";

export const metGetPayoutAndCommissionTrans = catchAsync(
    async (req, res, next) => {
      const { string, boolean, numbers } = req?.body?.searchFields || {};
  
      const {
        type,
        page = 1,
        limit = 10,
        sortBy = "created_at",
        sort = "desc",
      } = req.query;
  
      const metUser = req.metUser;
      const marketExecutiveId = metUser?._id;
  
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