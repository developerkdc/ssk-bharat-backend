import catchAsync from "../../Utils/catchAsync";
import DispatchModel from "../../database/schema/dispatch.schema.js";
import ApiError from "../../Utils/ApiError";
import SalesModel from "../../database/schema/salesOrder.schema";
import mongoose from "mongoose";
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
  const salesOrderData = await SalesModel.findById(req.body.sales_order_id);
  console.log(salesOrderData);
  if (!salesOrderData) {
    return next(new ApiError("No Sales Order Found", 404));
  }
  const {
    sales_order_no,
    total_amount,
    total_gst,
    total_item_amount,
    total_quantity,
    total_weight,
    sales_order_date,
    order_type,
    ssk_details,
    customer_details,
    Items,
  } = salesOrderData;
  const body = {
    ...req.body,
    sales_order_no: sales_order_no,
    order_type: order_type,
    delivery_status: "dispatched",
    tracking_date: {
      sales_order_date: sales_order_date,
    },
    ssk_details: ssk_details,
    customer_details: customer_details,
    Items: Items,
    total_weight: total_weight,
    total_quantity: total_quantity,
    total_item_amount: total_item_amount,
    total_gst: total_gst,
    total_amount: total_amount,
  };
  const dispatch = new DispatchModel(body);
  if (!dispatch) {
    throw new Error(new ApiError("Error during dispatch", 400));
  }
  await dispatch.save();
  if (dispatch) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: dispatch,
      message: "Dispatch Created",
    });
  }
});

export const fetchDispatchBasedonDeliveryStatus = catchAsync(
  async (req, res, next) => {
    const {
      type,
      page,
      limit = 10,
      sortBy = "dispatch_no",
      sort = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

  const { to, from , ...data } = req?.body?.filters || {};
    const matchQuery = data || {};
    if (type) {
      matchQuery.delivery_status = type;
    }

    if (to && from) {
      if (type == "dispatched") {
        matchQuery["tracking_date.dispatch_generated_date"] = {
          $gte: new Date(from),
          $lte: new Date(to),
        };
      } else if (type == "outForDelivery") {
        matchQuery["tracking_date.out_for_delivery.dispatch_date"] = {
          $gte: new Date(from),
          $lte: new Date(to),
        };
      }
      else if (type == "delivered") {
        matchQuery["tracking_date.delivered"]= {
          $gte: new Date(from),
          $lte: new Date(to),
        };
      }
    }

    const dispatchOrders = await DispatchModel.find(matchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sort })
      .exec();

    const totalDocuments = await DispatchModel.countDocuments(matchQuery);
    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      data: dispatchOrders,
      statusCode: 200,
      status: `All ${type} Orders`,
      totalPages: totalPages,
      currentPage: page,
    });
  }
);

export const outForDelivery = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = await DispatchModel.findByIdAndUpdate(
    { _id: id },
    {
      delivery_status: "outForDelivery",
      "tracking_date.out_for_delivery.dispatch_date":
        req.body?.tracking_date?.out_for_delivery?.dispatch_date || null,
      "tracking_date.out_for_delivery.estimate_delivery_date":
        req.body?.tracking_date?.out_for_delivery?.estimate_delivery_date ||
        null,
      "transport_details.hand_delivery.person_name":
        req.body?.transport_details?.hand_delivery?.person_name || null,
      "transport_details.hand_delivery.person_phone_no":
        req.body?.transport_details?.hand_delivery?.person_phone_no || null,
      "transport_details.courier.company_name":
        req.body?.transport_details?.courier?.company_name || null,
      "transport_details.courier.docket_no":
        req.body?.transport_details?.courier?.docket_no || null,
      "transport_details.road.transporter_name":
        req.body?.transport_details?.road?.transporter_name || null,
      "transport_details.road.vehicle_no":
        req.body?.transport_details?.road?.vehicle_no || null,
      "transport_details.road.driver_name":
        req.body?.transport_details?.road?.driver_name || null,
      "transport_details.road.driver_phone_no":
        req.body?.transport_details?.road?.driver_phone_no || null,
      "transport_details.rail.transporter_name":
        req.body?.transport_details?.rail?.transporter_name || null,
      "transport_details.rail.awb_no":
        req.body?.transport_details?.rail?.awb_no || null,
      "transport_details.air.transporter_name":
        req.body?.transport_details?.air?.transporter_name || null,
      "transport_details.air.awb_no":
        req.body?.transport_details?.air?.awb_no || null,
      "transport_details.delivery_challan_no":
        req.body?.transport_details?.delivery_challan_no || null,
      "transport_details.transport_type":
        req.body?.transport_details?.transport_type || null,
    },
    { new: true }
  );
  if (!updateData) {
    throw new Error(new ApiError("Order Not Found", 400));
  }
  if (updateData) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: updateData,
      message: "Out For Delivery Successful",
    });
  }
});

export const delivered = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Validate if the provided id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(new ApiError("Invalid Order ID", 400));
  }

  const updateData = await DispatchModel.findByIdAndUpdate(
    { _id: id },
    {
      delivery_status: "delivered",
      "tracking_date.delivered": req.body?.tracking_date?.delivered || null,
    },
    { new: true }
  );

  if (!updateData) {
    throw new Error(new ApiError("Order Not Found", 400));
  }

  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updateData,
    message: "Delivered Successfully",
  });
});
