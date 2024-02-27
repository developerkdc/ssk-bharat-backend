
const duplicateError = function(err,res){
    if(err.code === 11000){
        const duplicate = Object.entries(err?.keyValue);
        const message = duplicate.map(([key,value])=> `${value} is already exits`)
        err.message = message;
    }
} 

export const globalErrorHandler = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    duplicateError(err,res)
    return res.status(err.statusCode).json({
        statusCode:err.statusCode,
        status:"Failed",
        message:err.message,
        error:err,
        stack:err.stack
    })
}