import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError";
import METModel from "../database/schema/MET/MarketExecutive.schema";


const METauthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ApiError("Token not provided", 401));
    }
    const metUserId = jwt.verify(token, process.env.JWT_SECRET);
    if (!metUserId) return next(new ApiError("userId not found", 400));
    const metUser = await METModel.findOne({
      _id:metUserId?.metUserId,
      "current_data.status":true
    })
    if (!metUser) {
        return next(new ApiError("User Not Found", 404));
    }
    req.metUser = metUser;
    next()
  } catch (error) { 
    return next(error)
  }
};


export default METauthMiddleware;
