import mongoose from "mongoose"

const payoutAndCommissionTranSchema = new mongoose.Schema({
    marketExecutiveId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "market executive is required"]
    },
    commission: {
        type:{
            companyDetails: {
                companyId: {
                    type: String,
                    required: [true, "company Id is required"]
                },
                companyName: {
                    type: String,
                    required: [true, "company name is required"]
                },
                gstNo: {
                    type: String,
                    required: [true, "company name is required"]
                },
                firstName: {
                    type: String,
                    required: [true, "company name is required"]
                },
                lastName: {
                    type: String,
                    required: [true, "company name is required"]
                },
                email: {
                    type: String,
                    required: [true, "company name is required"]
                },
                mobileNo: {
                    type: String,
                    required: [true, "company name is required"]
                },
                companyType: {
                    type: String,
                    enum: {
                        values: ["retailers", "offlinestores"],
                        message: "company type must contain retailers or offlinestores"
                    }
                }
            },
            salesOrderId: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "sales order id is required"]
            },
            salesOrderNo: {
                type: Number,
                required: [true, "sales order no is required"]
            },
            salesOrderDate: {
                type: Date,
                required: [true, "sales order Date is required"]
            },
            salesOrderAmount:{
                type:Number,
                required:[true,"Amount is required"]
            },
            commissionPercentage:{
                type:Number,
                required:[true,"commission persentage is required"]
            },
            commissionAmount:{
                type:Number,
                required:[true,"commission amount is required"]
            }
        },
        default:null
    },
    payouts:{
        type:{
            payoutType:{
                type:String,
                required:[true,"payout type is required"]
            },
            transactionId:{
                type:String,
                default:null
            },
            payoutAmount:{
                type:Number,
                required:[true,"payout amount is required"]
            },
            tdsPercentage:{
                type:Number,
                required:[true,"TDS Percentage is required"]
            },
            tdsAmount:{
                type:Number,
                // required:[true,"TDS Amount is required"]
            },
            amountPaid:{
                type:Number,
                // required:[true,"total amount paid is required"]
            }
        },
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

payoutAndCommissionTranSchema.pre("save",function(next){
    const {payouts:{payoutAmount,tdsPercentage}} = this;
    this.payouts.tdsAmount = (payoutAmount/100)*tdsPercentage;
    this.payouts.amountPaid = this.payouts.payoutAmount - this.payouts.tdsAmount;
    next()
})

const payoutAndCommissionTransModel = mongoose.model("payoutAndCommissionTransaction",payoutAndCommissionTranSchema)
export default payoutAndCommissionTransModel; 