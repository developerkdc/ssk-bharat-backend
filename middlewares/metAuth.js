import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError";
import METModel from "../database/schema/MET/MarketExecutive.schema";


const METauthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ApiError("Token not provided", 401));
    }
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) return next(new ApiError("userId not found", 400));
    const user = await METModel.findById(userId.metUserId)
    if (!user) {
        return next(new ApiError("User Not Found", 404));
    }
    req.user = user;
    next()
  } catch (error) { 
    return next(error)
  }
};


export default METauthMiddleware;
