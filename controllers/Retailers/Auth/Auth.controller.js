import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";

export const RetailerLogin = catchAsync(async (req, res, next) => {
    const { mobileNo } = req.body;
    if (!mobileNo) return next(ApiError("Mobile number is required", 400))
    const retailer = await mongoose.model("retailers").findOne({ "current_data.register_mobile_no": mobileNo }, { "current_data.register_mobile_no": 1 });
    if (!retailer) return next(ApiError("This mobile number is not exists", 400));
    res.send("login")
})