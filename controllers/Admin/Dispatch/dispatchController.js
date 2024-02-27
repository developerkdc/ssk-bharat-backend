import catchAsync from "../../../Utils/catchAsync.js";
import DispatchModel from "../../../database/schema/Dispatch/dispatch.schema.js";
import ApiError from "../../../Utils/ApiError.js";
import SalesModel from "../../../database/schema/SalesOrders/salesOrder.schema.js";
import mongoose from "mongoose";
import { dynamicSearch } from "../../../Utils/dynamicSearch.js";
import retailerinventoryModel from "../../../database/schema/Inventory/RetailerInventory.schema.js";
import InventorySchema from "../../../database/schema/Inventory/RetailerInventory.schema.js";
import { approvalData } from "../../HelperFunction/approvalFunction.js";
import DynamicModel from "../../../Utils/DynamicModel.js";
import { createdByFunction } from "../../HelperFunction/createdByfunction.js";
import adminApprovalFunction from "../../HelperFunction/AdminApprovalFunction.js";

export const latestDispatchNo = catchAsync(async (req, res, next) => {
  try {
    // Find the latest purchase order by sorting in descending order based on purchase_order_date
    const latestDispatch = await DispatchModel.findOne()
      .sort({ created_at: -1 })
      .select("current_data.dispatch_no");
    if (latestDispatch) {
      return res.status(200).json({
        dispatch_no: latestDispatch.current_data.dispatch_no + 1,
        statusCode: 200,
        status: "success",
        message: "Latest Dispatch Number",
      });
    } else {
      // Handle the case where no purchase orders exist
      return res.status(200).json({
        dispatch_no: 1,
        statusCode: 200,
        status: "success",
        message: "Latest Dispatch Number",
      });
    }
  } catch (error) {
    console.error("Error getting latest dispatch number:", error);
    throw error;
  }
});

// export const createDispatch = catchAsync(async (req, res, next) => {
//   const salesOrderData = await SalesModel.findById(req.body.sales_order_id);
//   const user = req.user;
//   const latestDispatch = await DispatchModel.findOne()
//     .sort({ created_at: -1 })
//     .select("current_data.dispatch_no");
//   const {
//     sales_order_no,
//     total_amount,
//     total_gst,
//     total_item_amount,
//     total_quantity,
//     total_weight,
//     sales_order_date,
//     order_type,
//     ssk_details,
//     customer_details,
//     Items,
//   } = salesOrderData.current_data;
//   const body = {
//     current_data: {
//       ...req.body,
//       dispatch_no: latestDispatch
//         ? latestDispatch?.current_data?.dispatch_no + 1
//         : 1,
//       sales_order_no: sales_order_no,
//       order_type: order_type,
//       delivery_status: "dispatched",
//       tracking_date: {
//         sales_order_date: sales_order_date,
//       },
//       ssk_details: ssk_details,
//       customer_details: customer_details,
//       Items: Items,
//       total_weight: total_weight,
//       total_quantity: total_quantity,
//       total_item_amount: total_item_amount,
//       total_gst: total_gst,
//       total_amount: total_amount,
//       created_by: createdByFunction(user),
//     },
//     approver: approvalData(user),
//   };
//   const dispatch = new DispatchModel(body);

//   const salesOrder = await SalesModel.findByIdAndUpdate(
//     req.body.sales_order_id,
//     {
//       $set: {
//         "proposed_changes.dispatch_id": dispatch[0]._id,
//         "proposed_changes.status": true,
//         approver: approvalData(user),
//         updated_at: Date.now(),
//       },
//     },
//     { session, new: true } // { new: true } to return the updated document
//   );

//   if (!dispatch) {
//     throw new Error(new ApiError("Error during dispatch", 400));
//   }
//   await dispatch.save();

//   if (dispatch && salesOrder) {
//     return res.status(201).json({
//       statusCode: 201,
//       status: "success",
//       data: dispatch,
//       message: "Dispatch Created",
//     });
//   }
// });
export const createDispatch = catchAsync(async (req, res, next) => {
  let session;
  try {
    // Start a MongoDB session
    session = await mongoose.startSession();
    session.startTransaction();

    const salesOrderData = await SalesModel.findById(
      req.body.sales_order_id
    ).session(session);
    const user = req.user;
    const latestDispatch = await DispatchModel.findOne()
      .sort({ created_at: -1 })
      .select("current_data.dispatch_no")
      .session(session);

    // Extracting data from sales order
    const {
      sales_order_no,
      order_no,
      total_amount,
      total_gst,
      total_item_amount,
      total_quantity,
      total_weight,
      sales_order_date,
      estimate_delivery_date,
      order_date,
      order_type,
      ssk_details,
      customer_details,
      total_igst,
      total_cgst,
      total_sgst,
      Items,
    } = salesOrderData.current_data;

    const body = {
      current_data: {
        ...req.body,
        dispatch_no: latestDispatch
          ? latestDispatch.current_data.dispatch_no + 1
          : 1,
        sales_order_no: sales_order_no,
        order_no: order_no,
        order_date: order_date,
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
        total_igst: total_igst,
        total_cgst: total_cgst,
        total_sgst: total_sgst,
        created_by: createdByFunction(user),
      },
      approver: approvalData(user),
    };
    const dispatch = new DispatchModel(body);

    // Save dispatch
    await dispatch.save({ session });

    // Update sales order
    const updatedSalesOrder = await SalesModel.findByIdAndUpdate(
      req.body.sales_order_id,
      {
        $set: {
          "proposed_changes.dispatch_id": dispatch._id,
          "proposed_changes.status": false,
          approver: approvalData(user),
          updated_at: Date.now(),
        },
      },
      { session, new: true } // { new: true } to return the updated document
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    adminApprovalFunction({
      module: "dispatchorders",
      user: user,
      documentId: dispatch._id,
    });
    adminApprovalFunction({
      module: "salesorders",
      user: user,
      documentId: req.body.sales_order_id,
    });

    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: dispatch,
      message: "Dispatch Created",
    });
  } catch (error) {
    // If session exists, abort the transaction
    if (session) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch (abortError) {
        console.error("Error aborting transaction:", abortError);
      }
    }

    // Handle the error
    return next(new ApiError(error.message, 400));
  }
});

export const fetchDispatchBasedonDeliveryStatus = catchAsync(
  async (req, res, next) => {
    const { string, boolean, numbers } = req?.body?.searchFields || {};

    const {
      order_type,
      delivery_status,
      page,
      limit = 10,
      sortBy = "created_at",
      sort = "desc",
    } = req.query;
    const skip =  Math.max((page - 1) * limit, 0);;


    const search = req.query.search || "";

    let searchQuery = {};
    if (search != "" && req?.body?.searchFields) {
      const searchdata = dynamicSearch(search, boolean, numbers, string);
      if (searchdata?.length == 0) {
        return res.status(404).json({
          statusCode: 404,
          status: false,
          data: {
            data: [],
          },
          message: "Results Not Found",
        });
      }
      searchQuery = searchdata;
    }

    const { to, from, ...data } = req?.body?.filters || {};
    const matchQuery = data || {};
    if (delivery_status) {
      matchQuery["current_data.delivery_status"] = delivery_status;
      matchQuery["current_data.order_type"] = order_type;
    }
    if (to && from) {
      if (delivery_status == "dispatched") {
        console.log(
          new Date(from).toDateString(),
          ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        );
        matchQuery["current_data.tracking_date.dispatch_generated_date"] = {
          $gte: new Date(from),
          $lte: new Date(to),
        };
      } else if (delivery_status == "outForDelivery") {
        matchQuery[
          "current_data.tracking_date.out_for_delivery.dispatch_date"
        ] = {
          $gte: new Date(from),
          $lte: new Date(to),
        };
      } else if (delivery_status == "delivered") {
        matchQuery["current_data.tracking_date.delivered"] = {
          $gte: new Date(from),
          $lte: new Date(to),
        };
      }
    }

    const dispatchOrders = await DispatchModel.find({
      ...matchQuery,
      ...searchQuery,
      "current_data.status": true,
    })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sort })
      .exec();

    const totalDocuments = await DispatchModel.countDocuments({
      ...matchQuery,
      ...searchQuery,
    });
    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      data: dispatchOrders,
      statusCode: 200,
      status: "success",
      message: `All ${order_type} Dispatch Orders`,
      totalPages: totalPages,
      currentPage: page,
    });
  }
);

export const outForDelivery = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const updateData = await DispatchModel.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        "proposed_changes.delivery_status": "outForDelivery",
        "proposed_changes.tracking_date.out_for_delivery.dispatch_date":
          req.body?.tracking_date?.out_for_delivery?.dispatch_date || null,
        "proposed_changes.tracking_date.out_for_delivery.estimate_delivery_date":
          req.body?.tracking_date?.out_for_delivery?.estimate_delivery_date ||
          null,
        "proposed_changes.transport_details.hand_delivery.person_name":
          req.body?.transport_details?.hand_delivery?.person_name || null,
        "proposed_changes.transport_details.hand_delivery.person_phone_no":
          req.body?.transport_details?.hand_delivery?.person_phone_no || null,
        "proposed_changes.transport_details.courier.company_name":
          req.body?.transport_details?.courier?.company_name || null,
        "proposed_changes.transport_details.courier.docket_no":
          req.body?.transport_details?.courier?.docket_no || null,
        "proposed_changes.transport_details.road.transporter_name":
          req.body?.transport_details?.road?.transporter_name || null,
        "proposed_changes.transport_details.road.vehicle_no":
          req.body?.transport_details?.road?.vehicle_no || null,
        "proposed_changes.transport_details.road.driver_name":
          req.body?.transport_details?.road?.driver_name || null,
        "proposed_changes.transport_details.road.driver_phone_no":
          req.body?.transport_details?.road?.driver_phone_no || null,
        "proposed_changes.transport_details.rail.transporter_name":
          req.body?.transport_details?.rail?.transporter_name || null,
        "proposed_changes.transport_details.rail.awb_no":
          req.body?.transport_details?.rail?.awb_no || null,
        "proposed_changes.transport_details.air.transporter_name":
          req.body?.transport_details?.air?.transporter_name || null,
        "proposed_changes.transport_details.air.awb_no":
          req.body?.transport_details?.air?.awb_no || null,
        "proposed_changes.transport_details.delivery_challan_no":
          req.body?.transport_details?.delivery_challan_no || null,
        "proposed_changes.transport_details.transport_type":
          req.body?.transport_details?.transport_type || null,
        approver: approvalData(user),
        updated_at: Date.now(),
      },
    },
    { new: true }
  );
  if (!updateData) {
    throw new Error(new ApiError("Order Not Found", 400));
  }

  adminApprovalFunction({
    module: "dispatchorders",
    user: user,
    documentId: id,
  });

  if (updateData) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: updateData,
      message: "Out For Delivery Successful",
    });
  }
});

export const delivered = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let session;
  try {
    session = await mongoose.startSession();
    await session.startTransaction();
    // Validate if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(new ApiError("Invalid Order ID", 400));
    }
    const user = req.user;

    const updateData = await DispatchModel.findByIdAndUpdate(
      { _id: id },
      {
        "proposed_changes.delivery_status": "delivered",
        "proposed_changes.tracking_date.delivered":
          req.body?.tracking_date?.delivered,
        // approver: approvalData(user),
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!updateData) {
      throw new Error(new ApiError("Order Not Found", 400));
    }

    const retailerdetails = await DispatchModel.findById(id).populate({
      path: "current_data.customer_details.customer_id",
      select: "current_data.inventorySchema",
    });

    // const inventoryName =
    //   retailerdetails.current_data.customer_details.customer_id.current_data
    //     .inventorySchema;

    // const inventoryModel = DynamicModel(inventoryName, InventorySchema);
    // const items = retailerdetails.current_data.Items;
    // const inventoryArray = [];
    // for (const item of items) {
    //   console.log(item);
    //   const inventory = new inventoryModel({
    //     sales_order_no: retailerdetails.current_data.sales_order_no,
    //     supplierCompanyName:
    //       retailerdetails.current_data.ssk_details.company_name,
    //     CustomerDetails: retailerdetails.current_data.customer_details,
    //     receivedDate: retailerdetails.current_data.tracking_date.delivered,
    //     transportDetails: retailerdetails.current_data.transport_details,
    //     invoiceDetails: {
    //       invoiceNo: retailerdetails.current_data.dispatch_no,
    //       invoiceDate: retailerdetails.current_data.tracking_date.delivered,
    //       itemsAmount: retailerdetails.current_data.total_item_amount,
    //       gstAmount: retailerdetails.current_data.total_gst,
    //       totalAmount: retailerdetails.current_data.total_amount,
    //     },
    //     tracking_date: retailerdetails.current_data.tracking_date,
    //     itemsDetails: {
    //       product_id: item.product_id,
    //       item_name: item.item_name,
    //       category: item.category,
    //       sku: item.sku,
    //       hsn_code: item.hsn_code,
    //       weight: item.weight,
    //       unit: item.unit,
    //       rate_per_unit: item.rate_per_unit,
    //       quantity: item.quantity,
    //       receivedQuantity: item.quantity,
    //       item_amount: item.item_amount,
    //       gst: item.gst,
    //       total_amount: item.total_amount,
    //       availableQuantity: item.quantity,
    //     },
    //   });

    //   inventoryArray.push(inventory);
    //   await inventory.save();
    // }
    await session.commitTransaction();
    await session.endSession();

    adminApprovalFunction({
      module: "dispatchorders",
      user: user,
      documentId: id,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: updateData,
      message: "Delivered Successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
});

export const getSalesNoFromDispatchList = catchAsync(async (req, res, next) => {
  const order_type = req.params.orderType;
  const delivery_status = req.params.deliveryStatus;
  const salesNoFromDispatch = await DispatchModel.aggregate([
    {
      $match: {
        "current_data.status": true,
        "current_data.order_type": order_type,
        "current_data.delivery_status": delivery_status,
      },
    },
    {
      $group: {
        _id: "$current_data.sales_order_no",
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  if (salesNoFromDispatch) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: salesNoFromDispatch,
      message: `All Sales No From Dispatch List`,
    });
  }
});
