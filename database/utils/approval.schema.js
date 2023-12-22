import mongoose from "mongoose";

const userAndApprovals = new mongoose.Schema({
    created_by: {
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
            email: {
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
                ref: "Users"
            },
            name: {
                type: String,
                trim: true,
            },
            email_id: {
                type: String,
                validate: {
                    validator: function (value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    },
                    message: "approver one invalid email Id"
                }
            },
            employee_id: String,
            isApprove: {
                type: Boolean,
                default: false
            }
        },
        default: null,
    },
    approver_two: {
        type: {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            },
            name: String,
            email_id: {
                type: String,
                validate: {
                    validator: function (value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    },
                    message: "approver two invalid email Id"
                }
            },
            employee_id: String,
            isApprove: {
                type: Boolean,
                default: false
            }
        },
        default: null,
    }
})

export default userAndApprovals