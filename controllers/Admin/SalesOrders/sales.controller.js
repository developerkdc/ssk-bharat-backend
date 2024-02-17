import catchAsync from "../../../Utils/catchAsync";
import SalesModel from "../../../database/schema/SalesOrders/salesOrder.schema";
import ApiError from "../../../Utils/ApiError";
import mongoose from "mongoose";
import moment from "moment";
import payoutAndCommissionTransModel from "../../../database/schema/payoutAndCommission/payoutsAndCommissionTransaction.schema";
import marketExectiveCommissionModel from "../../../database/schema/MET/marketExectiveCommission.schema";
import MarketExecutiveModel from "../../../database/schema/MET/MarketExecutive.schema";
import offlinePaymentModel from "../../../database/schema/OfflinePayment/offlinePayment.schema";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import { approvalData } from "../../HelperFunction/approvalFunction";

export const latestSalesOrderNo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestSalesOrder = await SalesModel.findOne()
      .sort({ created_at: -1 })
      .select("sales_order_no");
    if (latestSalesOrder) {
      return res.status(200).json({
        sales_order_no: latestSalesOrder.sales_order_no + 1,
        statusCode: 200,
        status: "Latest Sales Order Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        sales_order_no: 1,
        statusCode: 200,
        status: "Latest Sales Order Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest sales order number:", error);
    throw error;
  }
});

export const createSalesOrder = catchAsync(async (req, res, next) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const latestSalesOrder = await SalesModel.findOne()
      .sort({ created_at: -1 })
      .select("current_data.sales_order_no");
    console.log(latestSalesOrder, "saless");
    // return res.json({ data: { ...req.body } });
    const sales = await SalesModel.create(
      [
        {
          current_data: {
            sales_order_no: latestSalesOrder
              ? latestSalesOrder?.current_data?.sales_order_no + 1
              : 1,
            ...req.body,
          },
          approver: approvalData(req.user),
        },
      ],
      { session }
    );
    if (!sales) {
      throw new Error(new ApiError("Error during Sales Order", 400));
    }

    if (sales[0].current_data.order_type === "offlinestores") {
      const dueDate = moment(sales[0].current_data.sales_order_date)
        .add(sales[0].current_data.est_payment_days, "days")
        .toISOString();
      const addOfflinePaymentDetails = await offlinePaymentModel.create(
        [
          {
            current_data: {
              salesOrderId: sales[0].current_data._id,
              salesOrderNo: sales[0].current_data.sales_order_no,
              salesOrderDate: sales[0].current_data.sales_order_date,
              offlineStoreDetails: {
                companyId: sales[0].current_data.customer_details.customer_id,
                companyName:
                  sales[0].current_data.customer_details.customer_name,
                companyType: sales[0].current_data.order_type,
                gstNo: sales[0].current_data.customer_details.bill_to.gst_no,
                firstName:
                  sales[0].current_data.customer_details.bill_to.first_name,
                lastName:
                  sales[0].current_data.customer_details.bill_to.last_name,
                email:
                  sales[0].current_data.customer_details.bill_to
                    .primary_email_id,
                mobileNo:
                  sales[0].current_data.customer_details.bill_to
                    .primary_mobile_no,
              },
              totalSalesAmount: Number(
                sales[0].current_data.total_amount
              ).toFixed(2),
              dueDate: dueDate,
              approver: approvalData(req.user),
            },
          },
        ],
        { session }
      );
    }
    if (sales[0].current_data.order_type !== "websites") {
      const marketExecutive = await marketExectiveCommissionModel.find({
        "current_data.isActive":true,
        "current_data.companyId":
          sales[0].current_data.customer_details.customer_id,
      });

      //appproval
      // const commission = await payoutAndCommissionTransModel.insertMany(
      //   marketExecutive.map((marketExec) => {
      //     return {
      //       current_data: {
      //         marketExecutiveId: marketExec.current_data.marketExecutiveId,
      //         commission: {
      //           companyDetails: {
      //             companyId: sales[0].current_data.customer_details.customer_id,
      //             companyName: sales[0].current_data.customer_details.customer_name,
      //             companyType: sales[0].current_data.order_type,
      //             gstNo: sales[0].current_data.customer_details.bill_to.gst_no,
      //             firstName: sales[0].current_data.customer_details.bill_to.first_name,
      //             lastName: sales[0].current_data.customer_details.bill_to.last_name,
      //             email: sales[0].current_data.customer_details.bill_to.primary_email_id,
      //             mobileNo: sales[0].current_data.customer_details.bill_to.primary_mobile_no,
      //           },
      //           salesOrderId: sales[0].current_data._id,
      //           salesOrderNo: sales[0].current_data.sales_order_no,
      //           salesOrderDate: sales[0].current_data.sales_order_date,
      //           salesOrderAmount: Number(sales[0].current_data.total_amount).toFixed(2),
      //           commissionPercentage: marketExec.current_data.commissionPercentage,
      //           commissionAmount: Number(
      //             (sales[0].current_data.total_amount / 100) * marketExec.current_data.commissionPercentage
      //           ).toFixed(2),
      //         },
      //       },
      //       approver: approvalData(req.user)
      //     };
      //   }),
      //   { session }
      // );

      // const updateAccountBalance = Promise.all(
      //   commission.map(async (marketExecutive) => {
      //     const updateAccountBalance = await MarketExecutiveModel.updateOne(
      //       { _id: marketExecutive.proposed_changes.marketExecutiveId },
      //       {
      //         $inc: {
      //           "proposed_changes.account_balance": Number(
      //             marketExecutive.proposed_changes.commission.commissionAmount
      //           ).toFixed(2),
      //         },
      //         $set: {
      //           approver: approvalData(req.user)
      //         }
      //       }
      //     );
      //   })
      // );

      const commission = await payoutAndCommissionTransModel.insertMany(
        marketExecutive.map((marketExec) => {
          return {
            marketExecutiveId: marketExec.current_data.marketExecutiveId,
            commission: {
              companyDetails: {
                companyId: sales[0].current_data.customer_details.customer_id,
                companyName:
                  sales[0].current_data.customer_details.customer_name,
                companyType: sales[0].current_data.order_type,
                gstNo: sales[0].current_data.customer_details.bill_to.gst_no,
                firstName:
                  sales[0].current_data.customer_details.bill_to.first_name,
                lastName:
                  sales[0].current_data.customer_details.bill_to.last_name,
                email:
                  sales[0].current_data.customer_details.bill_to
                    .primary_email_id,
                mobileNo:
                  sales[0].current_data.customer_details.bill_to
                    .primary_mobile_no,
              },
              salesOrderId: sales[0].current_data._id,
              salesOrderNo: sales[0].current_data.sales_order_no,
              salesOrderDate: sales[0].current_data.sales_order_date,
              salesOrderAmount: Number(
                sales[0].current_data.total_amount
              ).toFixed(2),
              commissionPercentage:
                marketExec.current_data.commissionPercentage,
              commissionAmount: Number(
                (sales[0].current_data.total_amount / 100) *
                  marketExec.current_data.commissionPercentage
              ).toFixed(2),
            },
          };
        }),
        { session }
      );

      const updateAccountBalance = Promise.all(
        commission.map(async (marketExecutive) => {
          const updateAccountBalance = await MarketExecutiveModel.updateOne(
            { _id: marketExecutive.marketExecutiveId },
            {
              $inc: {
                account_balance: Number(
                  marketExecutive.commission.commissionAmount
                ).toFixed(2),
              },
            }
          );
        })
      );
    }

    await session.commitTransaction();
    await session.endSession();

    if (sales) {
      return res.status(201).json({
        statusCode: 201,
        status: "success",
        data: sales,
        message: "Sales Order Created",
      });
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
});

export const fetchSalesOrders = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};

  const {
    type,
    page,
    limit = 10,
    sortBy = "sales_order_no",
    sort = "desc",
    search=""
  } = req.query;
  const skip = (page - 1) * limit;

  const { to, from, ...data } = req?.body?.filters || {};
  const matchQuery = data || {};
  if (type) {
    matchQuery["current_data.order_type"] = type;
  }

  if (to && from) {
    matchQuery["current_data.sales_order_date"] = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

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

  const salesOrders = await SalesModel.find({ ...matchQuery, ...searchQuery })
    .skip(skip)
    .limit(limit)
    .populate("current_data.refund_id")
    .sort({ [sortBy]: sort })
    .exec();

  const totalDocuments = await SalesModel.countDocuments({
    ...matchQuery,
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocuments / limit);

  return res.status(200).json({
    data: salesOrders,
    statusCode: 200,
    status: "success",
    message: `All ${type} Sales Orders`,
    totalPages: totalPages,
  });
});

export const getSalesOrderNoList = catchAsync(async (req, res, next) => {
  const offlineSalesOrderNo = await SalesModel.aggregate([
    {
      $match: {
        "current_data.status": true,
        "current_data.order_type": [req.params.type],
      },
    },
  ]);
  if (offlineSalesOrderNo) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: offlineSalesOrderNo,
      message: "All Offline Sales Order List",
    });
  }
});
