import catchAsync from "../../../Utils/catchAsync";
import offlinePaymentModel from "../../../database/schema/OfflinePayment/offlinePayment.schema";

export const addOfflinePayment = catchAsync(async (req,res,next)=>{
    const {paymentType,transactionId,upiId,followUpDate,remark,paymentAmount} = req.body
    const addPayment = await offlinePaymentModel.findByIdAndUpdate({_id:req.params.id},{
        $push:{
            payments:{
                paymentType,
                transactionId,
                upiId,
                followUpDate,
                paymentAmount,
                remark
            }
        },
        $inc:{
            recievedAmount:paymentAmount,
            balanceAmount:-paymentAmount
        }
    },{new:true})

    return res.status(201).json({
        statusCode: 201,
        status: true,
        data: addPayment,
        message: "payment was added",
      });
})

export const addFollowupAndRemark = catchAsync(async (req,res,next)=>{
    const {followUpDate,remark} = req.body
    const addFollowupAndRemark = await offlinePaymentModel.findByIdAndUpdate({_id:req.params.id},{
        $push:{
            followUp:{
                followUpDate,
                remark
            }
        },
    },{new:true})

    return res.status(201).json({
        statusCode: 201,
        status: true,
        data: addFollowupAndRemark,
        message: "Followup And Remark was added",
      });
})