import mongoose from "mongoose";
import userAndApprovals from "../utils/approval.schema";


const sampleOutward = new mongoose.Schema({
  deliveryChallanNo: String,
  items: [
    {
      itemName: { type: String, trim: true },
      category: { type: String, trim: true },
      sku: { type: String },
      hsnCode: { type: String },
      gstpercentage: { type: String },
      date: { type: Date, default: Date.now },
      quantity: { type: Number },
    },
  ],
  personName: { type: String },
  contactDetails: {
    email: { type: String },
    mobileNo: { type: String },
  },
  companyName: { type: String },
  gstNo: { type: String },
  address: {
    address: { type: String },
    location: { type: String },
    area: { type: String },
    city: { type: String },
    taluka: { type: String },
    district: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
  },

  approver: userAndApprovals,
});

const sampleOut = mongoose.model("SampleOutward", sampleOutward);
export default sampleOut;