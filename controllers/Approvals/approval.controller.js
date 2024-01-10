import mongoose from "mongoose";
import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import storePOModel from "../../database/schema/PurchaseOrders/offlineStorePurchaseOrder.schema";
import retailerPOModel from "../../database/schema/PurchaseOrders/retailerPurchaseOder.schema";

export const getApprovalPendingList = catchAsync(async (req, res, next) => {
  const { module, approval2 } = req.query;
  const { userId } = req.params;
  if (!module) return next(new ApiError("please provide module name", 400));

  const model = mongoose.model(module);

  let approvalList = await model.find({
    "approver.approver_one.user_id": userId,
    "approver.approver_one.isApprove": false,
  });

  if (approval2 === "true") {
    approvalList = await model.find({
      $and: [
        { "approver.approver_one.isApprove": true },
        {
          "approver.approver_two.user_id": userId,
          "approver.approver_two.isApprove": false,
        },
      ],
    });
  }

  //total pages
  const totalCategory = await model.countDocuments();
  const totalPages = Math.ceil(totalCategory / 10);

  return res.status(200).json({
    statusCode: 200,
    status: true,
    totalPages: totalPages,
    data: approvalList,
    message: "Approval Pending from your Side",
  });
});

export const Approved = catchAsync(async (req, res, next) => {

  const { module, approval2 } = req.query;
  const { userId } = req.params;
  const { isApprove, remark, documentId } = req.body;
  if (!module) return next(new ApiError("please provide module name", 400));

  const model = mongoose.model(module);
  const data = await model.findOne({ _id: documentId });

  if (!data) return next(new ApiError("the document does not exits", 400));

  let poModel;
  if (module === "orders" && data.current_data.order_type === "offlinestores") {
    poModel = storePOModel
  } else if (module === "orders" && data.current_data.order_type === "retailers") {
    poModel = retailerPOModel
  }

  let approvalList;

  if (!data.approver.approver_two) {
    approvalList = await model.updateOne(
      {
        _id: documentId,
        "approver.approver_one.user_id": userId,
        "approver.approver_one.isApprove": false,
      },
      {
        $set: {
          "approver.approver_one.isApprove": isApprove,
          "approver.approver_one.remarks": remark,
          "proposed_changes.status": true,
          current_data: Object.assign(data.proposed_changes, { status: true }),
        },
      }
    );

    if (module === "orders" && poModel) {
      if (approvalList.acknowledged && approvalList.modifiedCount > 0) {
        const companyPOStatus = await poModel.updateOne({ _id: data.current_data.purchase_order_id }, {
          $set: {
            status: true
          }
        })
      }
    }

    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: approvalList,
      message: "Document has been Approved",
    });
  } else if (data.approver.approver_two && !approval2) {
    approvalList = await model.updateOne(
      {
        _id: documentId,
        "approver.approver_one.user_id": userId,
        "approver.approver_one.isApprove": false,
      },
      {
        $set: {
          "approver.approver_one.isApprove": isApprove,
          "approver.approver_one.remarks": remark,
        },
      }
    );
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: approvalList,
      message: "Approval Pending from Approval 2",
    });
  } else if (data.approver.approver_two && approval2 === "true") {
    approvalList = await model.updateOne(
      {
        $and: [
          { _id: documentId },
          { "approver.approver_one.isApprove": true },
          {
            "approver.approver_two.user_id": userId,
            "approver.approver_two.isApprove": false,
          },
        ],
      },
      {
        $set: {
          "approver.approver_two.isApprove": isApprove,
          "approver.approver_two.remarks": remark,
          "proposed_changes.status": true,
          current_data: Object.assign(data.proposed_changes, { status: true }),
        },
      }
    );

    if (module === "orders" && poModel) {
      if (approvalList.acknowledged && approvalList.modifiedCount > 0) {
        const companyPOStatus = await poModel.updateOne({ _id: data.current_data.purchase_order_id }, {
          $set: {
            status: true
          }
        })
      }
    }

    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: approvalList,
      message: "Document has been Approved",
    });
  }

  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: approvalList,
    message: "Approval Pending",
  });

});

export const ApprovedByAdmin = catchAsync(async (req, res, next) => {

  const { module} = req.query;
  const { documentId } = req.body;
  if (!module) return next(new ApiError("please provide module name", 400));

  const model = mongoose.model(module);
  const data = await model.findOne({ _id: documentId });

  if (!data) return next(new ApiError("the document does not exits", 400));

  let poModel;
  if (module === "orders" && data.current_data.order_type === "offlinestores") {
    poModel = storePOModel
  }

  let approvalList = await model.updateOne({ _id: documentId }, {
    $set: {
      "proposed_changes.status": true,
      current_data: Object.assign(data.proposed_changes, { status: true })
    }
  });

  if (module === "orders" && poModel) {
    if (approvalList.acknowledged && approvalList.modifiedCount > 0) {
      const companyPOStatus = await poModel.updateOne({ _id: data.current_data.purchase_order_id }, {
        $set: {
          status: true
        }
      })
    }
  }

  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: approvalList,
    message: "Approval Pending",
  });

});