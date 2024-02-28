import mongoose from "mongoose";
import SchemaFunction from "../../../controllers/HelperFunction/SchemaFunction";

const ActiveUserSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    socket_id:{
        type:String,
    }
});

const activeUserModel = mongoose.model("activeUsers", ActiveUserSchema);
export default activeUserModel;
