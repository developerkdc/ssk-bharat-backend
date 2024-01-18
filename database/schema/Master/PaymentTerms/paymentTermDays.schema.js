import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";
import createdBy from "../../../utils/createdBy.schema";

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
   created_by:{
        type:createdBy,
        required:[true,"created by is required"]
      }
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
