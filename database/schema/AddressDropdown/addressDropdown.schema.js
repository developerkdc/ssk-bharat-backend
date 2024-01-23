import mongoose from "mongoose";

const dynamicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
});

// Create a model using the dynamic schema
const DynamicDistrict = mongoose.model("district", dynamicSchema);
const DynamicLocation = mongoose.model("location", dynamicSchema);
const DynamicTaluka = mongoose.model("taluka", dynamicSchema);
const DynamicArea = mongoose.model("area", dynamicSchema);
export default {
  district: DynamicDistrict,
  location: DynamicLocation,
  taluka: DynamicTaluka,
  area: DynamicArea,
};
