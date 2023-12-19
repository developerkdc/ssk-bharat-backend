export const globalErrorHandler = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    return res.status(err.statusCode).json({
        statusCode:err.statusCode,
        status:"Failed",
        message:err.message,
        error:err,
        stack:err.stack
    })
}