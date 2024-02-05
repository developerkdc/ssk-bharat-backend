import ApiError from "../Utils/ApiError"; // Make sure to provide the correct path
import rolesModel from "../database/schema/Master/Roles/roles.schema";

const rolesPermissions = (name, key) => {
  return async (req, res, next) => {
    try {
      let user = req.user;
      const permissions = await rolesModel.findById(user.current_data.role_id._id);

      if (!permissions) return new ApiError("Invalid Id", 400);
      const isAuthorized = permissions.current_data.permissions[name][key];
      if (isAuthorized != true) {
        return res.status(403).json({
          statusCode: 403,
          success: false,
          message: "User Dont have permission to access",
        });
      }
      next();
    } catch (error) {
      next(new ApiError(error.message, 500));
    }
  };
};

export default rolesPermissions;
