
import userModel from "../database/schema/user.schema";
import ApiError from "../middlewares/adminAuth"; // Make sure to provide the correct path

const rolesPermissions = (name,key) => {
  return async (req, res, next) => {
    try {
      const user = await userModel.findById("658184df8768ecf9a3f81d3c").populate("role_id")
      console.log(user,"userrrr");
      
      if (!user) {
        return next(new ApiError("User Not Found", 404));
      }

      const isAuthorized=user.role_id.permissions[name][key]
      if(isAuthorized!=true){
        return res.status(403).json({
            statusCode:403,
            success:false,
            message:"User Dont have permission to access"
        })
      }
      next();
    } catch (error) {
      console.error("Error in rolesPermissions middleware:", error);
      next(new ApiError("Internal Server Error", 500));
    }
  };
};

export default rolesPermissions;