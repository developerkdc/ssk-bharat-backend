import mongoose from "mongoose";

var RoleSchema = new mongoose.Schema({
  role_name: { type: String, min: 2, max: 25, required: true },
  permissions: {
    type: {
        user:{
          add:{type:Boolean,default:false},
          edit:{type:Boolean,default:false},
          view:{type:Boolean,default:false}
        },
        roles:{
          add:{type:Boolean,default:false},
          edit:{type:Boolean,default:false},
          view:{type:Boolean,default:false}
        },
        suppliers:{
          add:{type:Boolean,default:false},
          edit:{type:Boolean,default:false},
          view:{type:Boolean,default:false}
        },
        sskcompany:{
          add:{type:Boolean,default:false},
          edit:{type:Boolean,default:false},
          view:{type:Boolean,default:false}
        },
        retailer:{
          add:{type:Boolean,default:false},
          edit:{type:Boolean,default:false},
          view:{type:Boolean,default:false}
        },
    },
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date, default: null },
});

export default mongoose.model("RoleModel", RoleSchema, "roles");
