import mongoose from "mongoose";
import SchemaFunction from "../../../controllers/HelperFunction/SchemaFunction";

const ActiveUserSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  socket_id: {
    type: String,
  },
  loggedIn_at: {
    type: Date,
    default: Date.now,
  },
});

const activeUserModel = mongoose.model("activeUsers", ActiveUserSchema);
export default activeUserModel;
