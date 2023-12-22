import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
    bank_name: {
        type: String,
        trim: true,
        required: [true, "bank name is required"]
    },
    account_no: {
        type: String,
        trim: true,
        required: [true, "account no is required"]
    },
    confirm_account_no: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return value === this.account_no;
            },
            message: "confirm account is not matched"
        },
        required: [true, "confirm account no is required"]
    },
    ifsc_code: {
        type: String,
        trim: true,
        required: [true, "ifsc code is required"]
    },
    passbook_image: {
        type: String,
        default: null
    }
})
export default bankDetailsSchema;