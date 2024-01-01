import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";

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
        get: (value) => parseFloat(value).toFixed(2),
        set: (value) => parseFloat(value).toFixed(2),
        required: [true, "total sales amount is required"]
    },
    recievedAmount: {
        type: Number,
        get: (value) => parseFloat(value).toFixed(2),
        set: (value) => parseFloat(value).toFixed(2),
        default: 0
    },
    balanceAmount: {
        type: Number,
        get: (value) => parseFloat(value).toFixed(2),
        set: (value) => parseFloat(value).toFixed(2),
        default: function () {
            return this.totalSalesAmount - this.recievedAmount
        }
    },
    dueDate: {
        type: Date,
        default: null
    },
    OverdueDays: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ["pending", "partailly paid", "fully paid"]
        },
        default: "pending"
    },
    payments: {
        type: [
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
                followUpDate: {
                    type: Date,
                    default: null
                },
                paymentAmount: {
                    type: Number,
                    get: (value) => parseFloat(value).toFixed(2),
                    set: (value) => parseFloat(value).toFixed(2),
                    required: [true, "payment amount is required"]
                },
                remark: {
                    type: String,
                    required: [true, "remark is required"]
                }
            }
        ],
        default: null
    },
    followUp: {
        type: [{
            followUpDate: {
                type: Date,
                default: null
            },
            remark: {
                type: String,
                required: [true, "upi Id is required"]
            }
        }],
        default: null
    }
})

offlinePaymentSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const updatingData = this.getUpdate();
        const paymentData = await this.model.findOne(this.getQuery(), { recievedAmount: 1, balanceAmount: 1, totalSalesAmount: 1 })
        if (!paymentData) return next(new ApiError("payment hass not be added", 404))

        const receivedAmount = Number(updatingData["$inc"].recievedAmount) + Number(paymentData.recievedAmount);
        const balanceAmount = Number(paymentData.balanceAmount) - Number(updatingData["$inc"].balanceAmount);

        console.log(receivedAmount, balanceAmount, paymentData.totalSalesAmount, this.getUpdate())
        if (receivedAmount >= Number(paymentData.totalSalesAmount) || balanceAmount <= 0) {
            return next(new ApiError(`invalid payment Amount of ${updatingData["$push"].payments.paymentAmount}`, 422))
        }
        if (receivedAmount === Number(paymentData.totalSalesAmount)) {
            updatingData["$set"] = { paymentStatus: "fully paid" }
        }
        next()
    } catch (error) {
        next(error)
    }
})

const offlinePaymentModel = mongoose.model("offlinepayments", offlinePaymentSchema)
export default offlinePaymentModel