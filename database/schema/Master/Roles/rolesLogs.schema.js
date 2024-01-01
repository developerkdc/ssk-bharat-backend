import mongoose from "mongoose";

const roleLogsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
//   user_id: { type: mongoose.Schema.Types.ObjectId,ref:user,required: true },
  action: { type: String, required: true },
  target_id: { type: String, required: true },
  details: { type: String },
});

const rolesLogsModel = mongoose.model("roles Logs", roleLogsSchema);
export default rolesLogsModel;
