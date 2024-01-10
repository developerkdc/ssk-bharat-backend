import LogSchemaFunction from "../../utils/Logs.schema";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SampleInwardSchema = new Schema({
  challanNumber: {
    type: String,
    required: true,
    trim: true,
  },
  item: [
    {
      product_Id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: "products",
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      category: {
        type: String,
        required: true,
      },
      sku: {
        type: String,
        required: true,
      },
      sentQuantity: {
        type: Number,
        required: true,
      },
      receivedQuantity: {
        type: Number,
        required: true,
        trim: true,
      },
      itemWeight: {
        type: Number,
        required: true,
        trim: true,
      },
    },
  ],
  receiveDate: {
    type: Date,
    required: true,
  },
  deliveredBy: {
    name: {
      type: String,
      default: null,
    },
    contactDetails: {
      email: {
        type: String,
        default: null,
      },
      mobileNo: {
        type: String,
        default: null,
      },
    },
    companyName: {
      type: String,
      default: null,
    },
    gstNo: {
      type: String,
      default: null,
    },
    address: {
      address: {
        type: String,
        default: null,
      },
      location: {
        type: String,
        default: null,
      },
      area: {
        type: String,
        default: null,
      },
      district: {
        type: String,
        default: null,
      },
      taluka: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
      pincode: {
        type: String,
        default: null,
      },
    },
  },
  remarks: [
    {
      type: String,
      default: null,
    },
  ],
});

const sampleInmodel = mongoose.model("SampleInward", SampleInwardSchema);

LogSchemaFunction("sampleinward", sampleInmodel)

export default sampleInmodel;