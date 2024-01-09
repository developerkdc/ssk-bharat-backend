import mongoose from "mongoose";

const createdBy = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "user id is required"],
    },
    name: {
        type: String,
        trim: true,
        default: null,
    },
    email_id: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "invalid email Id",
        },
    },
    employee_id: {
        type: String,
        trim: true,
        required: [true, "employee id is required"],
    },
})

export default createdBy;