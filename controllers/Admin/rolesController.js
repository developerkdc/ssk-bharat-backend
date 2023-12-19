import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import rolesModel from "../../database/schema/roles.schema";

export const createRole = catchAsync(async (req, res, next) => {
  console.log("iuhrgiuh");
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
  console.log("iuhrgiuh");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === 'desc' ? -1 : 1;
  const search = req.query.search || '';
  const searchQuery = search ? { role_name: { $regex: search, $options: 'i' } } : {};
  const totalRoles = await rolesModel.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalRoles / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;

  const role = await rolesModel
    .find(searchQuery)
    .sort({ role_name: sortDirection })
    .skip(skip)
    .limit(limit);

  if (role) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: {
        roles:role,
        totalPages:totalPages,
        currentPage: validPage,
      },
      message: "All Roles and Permissions",
    });
  }
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
