import catchAsync from "../../../Utils/catchAsync";
import offlinePaymentModel from "../../../database/schema/OfflinePayment/offlinePayment.schema";

export const getOfflinePaymentDetails = catchAsync(async (req,res,next)=>{
    const allOfflinePayment = await offlinePaymentModel.find();
    return res.status(200).json({
        statusCode: 200,
        status: true,
        length:allOfflinePayment,length,
        data: allOfflinePayment,
        message: "All Offline Payment Data",
      });
})

export const addOfflinePayment = catchAsync(async (req,res,next)=>{
    const {paymentType,transactionId,upiId,followUpDate,remark,paymentAmount} = req.body
    const addPayment = await offlinePaymentModel.findOneAndUpdate({_id:req.params.id},{
        $push:{
            payments:{
                paymentType,
                transactionId,
                upiId,
                followUpDate,
                paymentAmount:paymentAmount,
                remark
            }
        },
        $inc:{
            recievedAmount:paymentAmount,
            balanceAmount:-paymentAmount
        },
        $set:{
            paymentStatus:"partailly paid"
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