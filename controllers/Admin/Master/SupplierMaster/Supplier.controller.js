import catchAsync from "../../../../Utils/catchAsync";
import SupplierModel from "../../../../database/schema/Master/Suppliers/supplier.schema";

export const GetSupplier = catchAsync(async (req, res, next) => {
  const Suppliers = await SupplierModel.find({});
  return res.status(201).json({
    statusCode: 200,
    status: "Success",
    length: Suppliers.length,
    data: {
      supplier: Suppliers,
    },
    message: "All Supplier",
  });
});

export const GetSupplierById = catchAsync(async (req, res, next) => {
  const Suppliers = await SupplierModel.findOne({ _id: req.params.id });
  return res.status(201).json({
    statusCode: 200,
    status: "Success",
    data: {
      supplier: Suppliers,
    },
  });
});

export const AddSupplier = catchAsync(async (req, res, next) => {
  const addSupplier = await SupplierModel.create(req.body);
  return res.status(201).json({
    statusCode: 201,
    status: "Success",
    data: {
      supplier: addSupplier,
    },
    message: "Supplier has created",
  });
});

export const UpdateSupplier = catchAsync(async (req, res, next) => {
  const {
    company_name,
    onboarding_date,
    company_status,
    approver_one,
    approver_two,
  } = req.body;
  const { id } = req.params;
  const updatedSupplier = await SupplierModel.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        company_name,
        company_status,
        onboarding_date,
        "approver_one.isApprove": approver_one?.isApprove,
        "approver_two.isApprove": approver_two?.isApprove,
      },
    },
    { new: true }
  );

  return res.status(200).json({
    statusCode: 200,
    status: "Updated",
    data: {
      supplier: updatedSupplier,
    },
    message: "Supplier has Updated",
  });
});
