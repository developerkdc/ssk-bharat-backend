import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import rolesModel from "../../../../database/schema/Master/Roles/roles.schema";
import adminApprovalFunction from "../../../HelperFunction/AdminApprovalFunction";
import { approvalData } from "../../../HelperFunction/approvalFunction";
import { createdByFunction } from "../../../HelperFunction/createdByfunction";

export const createRole = catchAsync(async (req, res, next) => {
  const user = req.user;
  const role = await rolesModel.create({
    current_data: { ...req.body, created_by: createdByFunction(user) },
    approver: approvalData(user),
  });

  if (!role) return new ApiError("Error while creating", 400);

  adminApprovalFunction({
    module: "roles",
    user: user,
    documentId: role._id,
  });

  if (role) {
    return res.status(201).json({
      statusCode: 201,
      status: "Success",
      data: role,
      message: "Role Created",
    });
  }
});

export const getRoles = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const sortField = req?.query?.sortBy || "created_at";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "success",
        data: {
          roles: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  // Count total roles with or without search
  const totalRoles = await rolesModel.countDocuments({
    ...searchQuery,
    "current_data.status": true,
  });

  if (!totalRoles) {
    throw new Error(new ApiError("No Data", 404));
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalRoles / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;

  // Fetch roles based on search and pagination
  const roles = await rolesModel
    .find({ ...searchQuery, "current_data.status": true })
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    statusCode: 200,
    status: "Success",
    data: {
      roles: roles,
      totalPages: totalPages,
      currentPage: validPage,
    },
    message: "All Roles and Permissions",
  });
});

export const getRolesList = catchAsync(async (req, res, next) => {
  const role = await rolesModel.aggregate([
    {
      $match: { "current_data.status": true, "current_data.isActive": true },
    },
    {
      $project: {
        _id: 1,
        role_name: "$current_data.role_name",
      },
    },
  ]);

  if (role) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: role,
      message: "All Roles List",
    });
  }
});

export const updateRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const { role_name, permissions, isActive } = req?.body;
  const role = await rolesModel.findByIdAndUpdate(
    id,
    {
      $set: {
        "proposed_changes.role_name": role_name,
        "proposed_changes.permissions": permissions,
        "proposed_changes.status": false,
        "proposed_changes.isActive": isActive,
        approver: approvalData(user),
        updated_at: Date.now(),
      },
    },
    { new: true }
  );

  if (!role) return new ApiError("Error while creating", 400);

  adminApprovalFunction({
    module: "roles",
    user: user,
    documentId: id,
  });

  return res.status(200).json({
    statusCode: 200,
    status: "Success",
    data: role,
    message: "Role Updated",
  });
});
