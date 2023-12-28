import catchAsync from "../../Utils/catchAsync";
import SalesModel from "../../database/schema/salesOrder.schema";
import ApiError from "../../Utils/ApiError";
import mongoose from "mongoose";
import payoutAndCommissionTransModel from "../../database/schema/payoutsAndCommissionTransaction.schema";
import marketExectiveCommissionModel from "../../database/schema/marketExectiveCommission.schema";
import MarketExecutiveModel from "../../database/schema/MarketExecutive.schema";

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
    session.startTransaction()
    const sales = await SalesModel.create([req.body], { session });
    if (!sales) {
      throw new Error(new ApiError("Error during Sales Order", 400));
    }

    const marketExecutive = await marketExectiveCommissionModel.find({ companyId: sales[0].customer_details.customer_id });



    const commission = await payoutAndCommissionTransModel.insertMany(marketExecutive.map((marketExec) => {
      return {
        marketExecutiveId: marketExec.marketExecutiveId,
        commission: {
          companyDetails: {
            companyId: sales[0].customer_details.customer_id,
            companyName: sales[0].customer_details.customer_name,
            companyType: sales[0].order_type
          },
          salesOrderId: sales[0]._id,
          salesOrderNo: sales[0].sales_order_no,
          salesOrderAmount: sales[0].total_amount,
          commissionPercentage: marketExec.commissionPercentage,
          commissionAmount: Number((sales[0].total_amount / 100) * marketExec.commissionPercentage).toFixed(2)
        },
      }
    }), { session })

    const updateAccountBalance = Promise.all(commission.map(async (marketExecutive) => {
      const updateAccountBalance = await MarketExecutiveModel.updateOne({ _id: marketExecutive.marketExecutiveId }, {
        $inc: {
          account_balance: Number(marketExecutive.commission.commissionAmount).toFixed(2)
        }
      })
    }))

    await session.commitTransaction();
    await session.endSession();

    if (sales) {
      return res.status(201).json({
        statusCode: 201,
        status: true,
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
  const {
    type = "Store",
    page,
    limit = 10,
    sortBy = "sales_order_no",
    sort = "desc",
  } = req.query;
  const skip = (page - 1) * limit;

  const matchQuery = {
    order_type: type,
    ...(req.body.filters || {}),
  };

  const salesOrders = await SalesModel.find(matchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sort })
    .exec();

  const totalDocuments = await SalesModel.countDocuments(matchQuery);
  const totalPages = Math.ceil(totalDocuments / limit);

  if (salesOrders.length === 0) {
    return next(new ApiError("No Data Found", 404));
  }

  return res.status(200).json({
    data: salesOrders,
    statusCode: 200,
    status: `All ${type} Sales Orders`,
    totalPages: totalPages,
    currentPage: page,
  });
});