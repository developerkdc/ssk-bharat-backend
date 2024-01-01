import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import rolesModel from "../../../../database/schema/Master/Roles/roles.schema";

export const createRole = catchAsync(async (req, res, next) => {
  const role = await rolesModel.create(req.body);
  if (role) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
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
  const searchQuery = search
    ? { role_name: { $regex: search, $options: "i" } }
    : {};

  // Count total roles with or without search
  const totalRoles = await rolesModel.countDocuments(searchQuery);

  if (!totalRoles) {
    throw new Error(new ApiError("No Data", 404));
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalRoles / limit);
  if (page > totalPages) throw new Error(new ApiError("Invalid Page", 404));
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;

  // Fetch roles based on search and pagination
  const roles = await rolesModel
    .find(searchQuery)
    .sort({ role_name: sortDirection })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: {
      roles: roles,
      totalPages: totalPages,
      currentPage: validPage,
    },
    message: "All Roles and Permissions",
  });
});

export const getRolesList = catchAsync(async (req, res, next) => {
  console.log("iuhrgiuh");
  const role = await rolesModel.aggregate([
    {
      $project: {
        _id: 1,
        role_name: 1,
      },
    },
  ]);

  if (role) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: role,
      message: "All Roles List",
    });
  }
});

export const updateRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const role = await rolesModel.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );
  console.log(role);
  if (!role) return next(new ApiError("Role Not Found", 404));
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: role,
    message: "Role Updated",
  });
});
