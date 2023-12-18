import ApiError from "../../Utils/ApiError.js";
import catchAsync from "../../Utils/catchAsync.js";
import connect from "../../database/mongo.service.js";

export const LoginUser = catchAsync(async (req, res, next) => {
  const abc = "qwerty";
  console.log(await connect().local)
  return res.status(200).json({
    message: abc
  })
})
