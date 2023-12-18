import ApiError from "./ApiError";

const catchAsync = (fn)=>{
    return async (req,res,next)=>{
        try {
            await fn(req,res,next)
        } catch (error) {
           return next(new ApiError(error.message,400))
        }
    }
}

export default catchAsync;