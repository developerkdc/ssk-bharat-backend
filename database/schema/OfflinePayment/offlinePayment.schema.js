import mongoose from "mongoose";

const offlinePaymentSchema = new mongoose.Schema({
    salesOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "sale order id is required"]
    },
    salesOrderNo: {
        type: Number,
        required: [true, "sale order No is required"]
    },
    salesOrderDate: {
        type: Date,
        required: [true, "sales order Date is required"]
    },
    offlineStoreDetails: {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
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
        }
    },
    totalSalesAmount: {
        type: Number,
        required: [true, "total sales amount is required"]
    },
    recievedAmount: {
        type: Number,
        default: 0
    },
    balanceAmount: {
        type: Number,
        default: function(){
            return this.totalSalesAmount - this.recievedAmount
        }
    },
    dueDate: {
        type: Date,
        default:null
    },
    OverdueDays: {
        type: String,
        default:null
    },
    paymentStatus:{
        type:String,
        enum:{
            values:["pending","partailly paid","fully paid"]
        },
        default:"pending"
    },
    payments: {
        type:[
            {
                paymentType: {
                    type: String,
                    required: [true, "payment Type is required"]
                },
                transactionId: {
                    type: String,
                    required: [true, "transaction Id is required"]
                },
                upiId: {
                    type: String,
                    required: [true, "upi Id is required"]
                },
                followUpDate:{
                    type:Date,
                    default:null
                },
                remark:{
                    type: String,
                    required: [true, "upi Id is required"]
                }
            }
        ],
        default:null
    },
    followUp:{
        type:[{
            followUpDate:{
                type:Date,
                default:null
            },
            remark:{
                type: String,
                required: [true, "upi Id is required"]
            }
        }],
        default:null
    }
})

const offlinePaymentModel = mongoose.model("offlinepayments", offlinePaymentSchema)
export default offlinePaymentModel