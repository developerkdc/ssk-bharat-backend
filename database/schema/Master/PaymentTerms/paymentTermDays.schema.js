import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";

const PaymentTermSchema = SchemaFunction(
  new mongoose.Schema({
    payment_term_days: {
      type: Number,
      required: [true, "Payment Term Days is required"],
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: {
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
      },
      required: [true, "created by is required"],
    },
  })
);

PaymentTermSchema.index(
  { "current_data.payment_term_days": 1 },
  { unique: true }
);

const paymentTermDaysModel = mongoose.model(
  "paymenttermdays",
  PaymentTermSchema
);

LogSchemaFunction("paymenttermdays", paymentTermDaysModel);

export default paymentTermDaysModel;
