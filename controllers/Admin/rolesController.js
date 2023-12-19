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
  const role = await rolesModel.find();
  if (role) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: role,
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
    }
  ]);
  
  if (role) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: role,
      message: "All Roles and Permissions",
    });
  }
});
