import catchAsync from "../../Utils/catchAsync";
import SalesModel from "../../database/schema/salesOrder.schema";

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
    const sales = await SalesModel.create(req.body);
    if (sales) {
      return res.status(201).json({
        statusCode: 201,
        status: true,
        data: sales,
        message: "Sales Order Created",
      });
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