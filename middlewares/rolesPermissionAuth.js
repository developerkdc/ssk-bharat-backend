
import ApiError from "../Utils/ApiError"; // Make sure to provide the correct path

const rolesPermissions = (name, key) => {
  return async (req, res, next) => {
    try {
      let user = req.user
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
      console.error("Error in roles Permissions middleware:", error);
      next(new ApiError("Internal Server Error", 500));
    }
  };
};

export default rolesPermissions;
