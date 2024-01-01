import mongoose from "mongoose";

const UserLogSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  action: { type: String, default: null },
  userUpdatedEmp_id: { type: String, default: null },
  userCreatedEmp_id: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  updatedFields: { type: mongoose.Schema.Types.Mixed },
});

const userlogModel = mongoose.model("UsersLogs", UserLogSchema);

export default userlogModel;