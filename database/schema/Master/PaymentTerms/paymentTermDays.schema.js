import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";

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
export default paymentTermDaysModel;
