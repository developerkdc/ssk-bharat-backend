import userModel from "../database/schema/user.schema";
import ApiError from "../middlewares/adminAuth"; // Make sure to provide the correct path

const rolesPermissions = (name, key) => {
  return async (req, res, next) => {
    try {
      let userId = req.userId
      const user = await userModel
        .findById(userId)
        .populate("role_id");
      if (!user) {
        return next(new ApiError("User Not Found", 404));
      }

      const isAuthorized = user.role_id.permissions[name][key];
      if (isAuthorized != true) {
        return res.status(403).json({
          statusCode: 403,
          success: false,
          message: "User Dont have permission to access",
        });
      }
      next();
    } catch (error) {
      console.error("Error in rolesPermissions middleware:", error);
      next(new ApiError("Internal Server Error", 500));
    }
  };
};

export default rolesPermissions;
