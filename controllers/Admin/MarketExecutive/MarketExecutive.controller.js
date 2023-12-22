import catchAsync from "../../../Utils/catchAsync";
import MarketExecutiveModel from "../../../database/schema/MarketExecutive.schema";

export const addMarketExec = catchAsync(async (req,res)=>{
    const addME = await MarketExecutiveModel.create(req.body);
    return res.status(201).json({
        statusCode:201,
        status:"created",
        data:{
            MarketExecutive:addME
        }
    })
})