import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError";
import mongoose from "mongoose";

const model = mongoose.model("retailers");

const retailersAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ApiError("Token not provided", 401));
    }
    const retailerId = jwt.verify(token, process.env.JWT_SECRET);

    if (!retailerId) return next(new ApiError("userId not found", 400));
    
    const retailerUser = await model.findOne({
      _id: retailerId?.retailer,
      "current_data.status": true,
    });
    if (!retailerUser) {
      return next(new ApiError("User Not Found", 404));
    }
    req.retailerUser = retailerUser;
    next();
  } catch (error) {
    return next(error);
  }
};

export default retailersAuthMiddleware;
