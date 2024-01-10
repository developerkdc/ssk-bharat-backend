import mongoose from "mongoose";
import SchemaFunction from "../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../utils/Logs.schema";

const refundSchema = SchemaFunction(
  new mongoose.Schema({
    sales_order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Sales ID is required"],
      ref: "salesorders",
      unique: true,
    },
    total_amount: {
      type: Number,
      required: [true, "Refund Amount is required"],
      trim: true,
    },
    refund_amount: {
      type: Number,
      required: [true, "Refunded Amount is required"],
      trim: true,
    },
    transaction_id: {
      type: String,
      required: [true, "Transaction ID is required"],
      trim: true,
    },
    refund_type: {
      type: String,
      required: [true, "Refund Type is required"],
      enum: ["neft", "rtgs", "cheque"],
    },
  })
);

refundSchema.index({ "current_data.sales_order_id": 1 }, { unique: true });

const refundModel = mongoose.model("refunds", refundSchema);
LogSchemaFunction("refunds", refundModel);
export default refundModel;
