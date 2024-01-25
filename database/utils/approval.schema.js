import mongoose from "mongoose";

const userAndApprovals = new mongoose.Schema({
    updated_by: {
        type: {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "user id is required"]
            },
            name: {
                type: String,
                trim: true,
                default: null
            },
            email_id: {
                type: String,
                trim: true,
                validate: {
                    validator: function (value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    },
                    message: "invalid email Id"
                }
            },
            employee_id: {
                type: String,
                trim: true,
                required: [true, "employee id is required"]
            },
        },
        required: [true, "created by is required"]
    },
    approver_one: {
        type: {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
                required:[true,"user_id for approvar one is required"]
            },
            name: {
                type: String,
                trim: true,
                required:[true,"name for approvar one is required"]
            },
            email_id: {
                type: String,
                validate: {
                    validator: function (value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    },
                    message: "approver one invalid email Id"
                },
                required:[true,"email id for approvar one is required"]
            },
            employee_id: String,
            remarks:String,
            isApprove: {
                type: Boolean,
                default: false
            },
            isRejected:{
                type:Boolean,
                default:false
            }
        },
        default: null,
    },
    approver_two: {
        type: {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
                required:[true,"user_id for approvar two is required"]
            },
            name: {
                type: String,
                trim: true,
                required:[true,"name for approvar two is required"]
            },
            email_id: {
                type: String,
                validate: {
                    validator: function (value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    },
                    message: "approver two invalid email Id"
                },
                required:[true,"email id for approvar two is required"]
            },
            employee_id: String,
            remarks:String,
            isApprove: {
                type: Boolean,
                default: false
            },
            isRejected:{
                type:Boolean,
                default:false
            }
        },
        default: null,
    }
})

export default userAndApprovals