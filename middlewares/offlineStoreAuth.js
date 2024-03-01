import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError";
import mongoose from "mongoose";

const model = mongoose.model("offlinestores");

const offlineStoreAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ApiError("Token not provided", 401));
    }
    const offlineId = jwt.verify(token, process.env.JWT_SECRET);
    console.log(offlineId, "offlineid");
    if (!offlineId) return next(new ApiError("userId not found", 400));
    const offlineUser = await model.findOne({
      _id: offlineId?.offlinestore,
      "current_data.status": true,
    });
    if (!offlineUser) {
      return next(new ApiError("User Not Found", 404));
    }
    req.offlineUser = offlineUser;
    next();
  } catch (error) {
    return next(error);
  }
};

export default offlineStoreAuthMiddleware;
