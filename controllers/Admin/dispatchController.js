import catchAsync from "../../Utils/catchAsync";
import DispatchModel from "../../database/schema/dispatch.schema.js";
import ApiError from "../../Utils/ApiError";
import SalesModel from "../../database/schema/salesOrder.schema";
export const latestDispatchNo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestDispatch = await DispatchModel.findOne()
      .sort({ created_at: -1 })
      .select("sales_order_no");
    if (latestDispatch) {
      return res.status(200).json({
        dispatch_no: latestDispatch.dispatch_no + 1,
        statusCode: 200,
        status: "Latest Dispatch Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        dispatch_no: 1,
        statusCode: 200,
        status: "Latest Dispatch Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest dispatch number:", error);
    throw error;
  }
});

export const createDispatch = catchAsync(async (req, res, next) => {

  const salesOrderData=await SalesModel.findById(req.body.sales_order_id)
  console.log(salesOrderData)
  if(!salesOrderData){
    return next(new ApiError("No Sales Order Found", 404));
  }
  const{sales_order_no,total_amount,total_gst,total_item_amount,total_quantity,total_weight,sales_order_date,order_type,ssk_details,customer_details,Items}=salesOrderData
  const body={
    ...req.body,
    sales_order_no:sales_order_no,
    order_type:order_type,
    delivery_status:"dispatched",
    tracking_date:{
      sales_order_date:sales_order_date,
    },
    ssk_details:ssk_details,
    customer_details:customer_details,
    Items:Items,
    total_weight:total_weight,
    total_quantity:total_quantity,
    total_item_amount:total_item_amount,
    total_gst:total_gst,
    total_amount:total_amount
  }
  const dispatch =  new DispatchModel(body);
  if (!dispatch) {
    throw new Error(new ApiError("Error during dispatch", 400));
  }
  await dispatch.save()
  if (dispatch) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: dispatch,
      message: "Dispatch Created",
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

  const salesOrders = await DispatchModel.find(matchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sort })
    .exec();

  const totalDocuments = await DispatchModel.countDocuments(matchQuery);
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
