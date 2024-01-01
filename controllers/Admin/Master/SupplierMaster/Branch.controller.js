import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import fs from "fs";
import supplierBranchModel from "../../../../database/schema/Master/Branch/Branch.schema";

export const getAllBranchSuppliers = catchAsync(async (req, res, next) => {
  const { filter = {} } = req.body;
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  const AllSuppliers = await supplierBranchModel
    .aggregate([
      {
        $match: filter,
      },
      {
        $limit: limit,
      },
      {
        $skip: page * limit - limit,
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplierId",
          foreignField: "_id",
          as: "supplierId",
        },
      },
      {
        $unwind: "$supplierId",
      },
    ])
    .sort(req.query.sort || "-created_at");
  return res.status(200).json({
    statusCode: 200,
    status: "Success",
    AllSuppliers: AllSuppliers.length,
    data: {
      supplier_branch: AllSuppliers,
    },
    message: "Supplier All Branch",
  });
});
export const getBranchOfSupplier = catchAsync(async (req, res, next) => {
  const supplierBranch = await supplierBranchModel.find({
    supplierId: req.params.supplierId,
  });
  return res.status(200).json({
    statusCode: 200,
    status: "Success",
    data: {
      supplier_branch: supplierBranch,
    },
    message: "Supplier All Branch",
  });
});
export const addBranch = catchAsync(async (req, res, next) => {
  const branch = await supplierBranchModel.create(req.body);
  console.log(req.body);
  return res.status(201).json({
    statusCode: 201,
    status: "Created",
    data: {
      supplier_branch: branch,
    },
    message: "Supplier Branch created",
  });
});
export const updateBranch = catchAsync(async (req, res, next) => {
  const { branchId } = req.query;
  const { contact_person, ...data } = req.body;
  console.log(data, contact_person);
  if (!branchId) {
    return next(new ApiError("branch id is required"));
  }

  const updateBranch = await supplierBranchModel.findByIdAndUpdate(
    { _id: branchId, supplierId: req.params.supplierId },
    {
      $set: data,
    },
    { new: true }
  );

  return res.status(200).json({
    statusCode: 200,
    status: "Updated",
    data: {
      supplier_branch: updateBranch,
    },
    message: "Supplier Branch updated",
  });
});
export const uploadDocument = catchAsync(async (req, res, next) => {
  const { branchId, supplierId } = req.params;
  const supplierBranch = await supplierBranchModel.findOne({
    _id: branchId,
    supplierId: supplierId,
  });
  const images = {};
  console.log(req.files);
  if (req.files) {
    for (let i in req.files) {
      images[i] = req.files[i][0].filename;
      if (
        fs.existsSync(
          `./uploads/admin/supplierDocument/${
            i.split("_")[0] === "passbook"
              ? supplierBranch.kyc.bank_details[i]
              : supplierBranch.kyc[i.split("_")[0]][i]
          }`
        )
      ) {
        fs.unlinkSync(
          `./uploads/admin/supplierDocument/${
            i.split("_")[0] === "passbook"
              ? supplierBranch.kyc.bank_details[i]
              : supplierBranch.kyc[i.split("_")[0]][i]
          }`
        );
      }
    }
  }
  const updatedImages = await supplierBranchModel.updateOne(
    { _id: branchId, supplierId: supplierId },
    {
      $set: {
        "kyc.pan.pan_image": images.pan_image,
        "kyc.gst.gst_image": images.gst_image,
        "kyc.bank_details.passbook_image": images.passbook_image,
      },
    }
  );

  return res.status(200).json({
    statusCode: 200,
    status: "Updated",
    data: {
      KYC_Images: updatedImages,
    },
    message: "images has been uploaded",
  });
});
export const AddConatct = catchAsync(async (req, res, next) => {
  const { supplierId, branchId } = req.params;
  if (!supplierId || !branchId) {
    return next(new ApiError("supplierId or BranchId is required", 400));
  }
  const addConatct = await supplierBranchModel.findByIdAndUpdate(
    { _id: branchId, supplierId: supplierId },
    {
      $push: {
        contact_person: req.body,
      },
    },
    { runValidators: true, new: true }
  );

  return res.status(201).json({
    statusCode: 201,
    status: "Created",
    data: {
      supplier_branch: addConatct,
    },
    message: "Supplier Branch contact created",
  });
});
export const UpdateContact = catchAsync(async (req, res, next) => {
  const { supplierId, branchId } = req.params;
  const {
    first_name,
    last_name,
    role,
    primary_email,
    secondary_email,
    primary_mobile,
    secondary_mobile,
    isPrimary,
  } = req.body;
  if (!req.query.contactId) {
    return next(new ApiError("contactId is required", 400));
  }
  const updatedContact = await supplierBranchModel.findByIdAndUpdate(
    {
      _id: branchId,
      supplierId: supplierId,
      "contact_person._id": req.query.contactId,
    },
    {
      $set: {
        "contact_person.$[e].first_name": first_name,
        "contact_person.$[e].last_name": last_name,
        "contact_person.$[e].role": role,
        "contact_person.$[e].primary_email": primary_email,
        "contact_person.$[e].secondary_email": secondary_email,
        "contact_person.$[e].primary_mobile": primary_mobile,
        "contact_person.$[e].secondary_mobile": secondary_mobile,
        "contact_person.$[e].isPrimary": isPrimary,
      },
    },
    {
      arrayFilters: [{ "e._id": req.query.contactId }],
      runValidators: true,
      new: true,
    }
  );

  return res.status(200).json({
    statusCode: 200,
    status: "Updated",
    data: {
      supplier_branch: updatedContact,
    },
    message: "Supplier Branch contact updated",
  });
});
