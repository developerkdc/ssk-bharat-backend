import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import marketExectiveCommissionModel from "../../../database/schema/MET/marketExectiveCommission.schema";

export const METMyStore = catchAsync(
    async (req, res, next) => {
      const { string, boolean, numbers } = req?.body?.searchFields || {};
      const search = req.query.search || "";
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const sort = req.query.sort || "desc";
      const sortBy = req.query.sortBy || "current_data.commisionPercentage"
      const metUser = req.metUser;
  
      const sortDirection = sort === "desc" ? -1 : 1;
  
      let searchQuery = {};
      if (search != "" && req?.body?.searchFields) {
        const searchdata = dynamicSearch(search, boolean, numbers, string);
        searchQuery = searchdata;
      }
  
      const MarketExectiveCompany = await marketExectiveCommissionModel.aggregate([
        {
          $match: { "current_data.marketExecutiveId": new mongoose.Types.ObjectId(metUser?._id), "current_data.status": true }
        },
        {
          $lookup: {
            from: "retailers",
            foreignField: "_id",
            localField: "current_data.companyId",
            pipeline: [
              {
                $project: {
                  current_data: {
                    company_name: 1,
                    pan: {
                      pan_no: 1
                    }
                  }
                }
              }
            ],
            as: "retailers"
          }
        },
        {
          $lookup: {
            from: "offlinestores",
            foreignField: "_id",
            localField: "current_data.companyId",
            pipeline: [
              {
                $project: {
                  current_data: {
                    company_name: 1,
                    pan: {
                      pan_no: 1
                    }
                  }
                }
              }
            ],
            as: "offlinestores"
          }
        },
        {
          $match: { ...searchQuery }
        },
        {
          $sort: { [sortBy]: sortDirection }
        },
        {
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        },
      ])
  
      const totalDocuments = await marketExectiveCommissionModel.countDocuments({
        "current_data.marketExecutiveId": new mongoose.Types.ObjectId(metUser?._id),
        "current_data.status": true,
        ...searchQuery,
      })
      const totalPages = Math.ceil(totalDocuments / limit);
  
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        length:MarketExectiveCompany.length,
        totalPage: totalPages,
        data: {
          MarketExectiveCompany: MarketExectiveCompany,
        },
        message: "Commission Listing based on Market Executive"
      });
    }
  );