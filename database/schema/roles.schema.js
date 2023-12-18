import mongoose from "mongoose";

var RoleSchema = new mongoose.Schema({
  role_name: { type: String, min: 2, max: 25, required: true },
  permissions: {
    type: {
        view_user:{type:Boolean,default:false},
        add_user:{type:Boolean,default:false},
        edit_user:{type:Boolean,default:false},

        view_roles:{type:Boolean,default:false},
        add_roles:{type:Boolean,default:false},
        edit_roles:{type:Boolean,default:false},

        view_supplier:{type:Boolean,default:false},
        add_supplier:{type:Boolean,default:false},
        edit_supplier:{type:Boolean,default:false},

        view_product:{type:Boolean,default:false},
        add_product:{type:Boolean,default:false},
        edit_product:{type:Boolean,default:false},

        view_retailer:{type:Boolean,default:false},
        add_retailer:{type:Boolean,default:false},
        edit_retailer:{type:Boolean,default:false},

        view_ssk:{type:Boolean,default:false},
        add_ssk:{type:Boolean,default:false},
        edit_ssk:{type:Boolean,default:false},
        
        view_met:{type:Boolean,default:false},
        add_met:{type:Boolean,default:false},
        edit_met:{type:Boolean,default:false},

        view_category:{type:Boolean,default:false},
        add_category:{type:Boolean,default:false},
        edit_category:{type:Boolean,default:false},

        view_unit:{type:Boolean,default:false},
        add_unit:{type:Boolean,default:false},
        edit_unit:{type:Boolean,default:false},

        view_gst:{type:Boolean,default:false},
        add_gst:{type:Boolean,default:false},
        edit_gst:{type:Boolean,default:false},

        view_hsn:{type:Boolean,default:false},
        add_hsn:{type:Boolean,default:false},
        edit_hsn:{type:Boolean,default:false},

        view_purchase_order:{type:Boolean,default:false},
        add_purchase_order:{type:Boolean,default:false},
        edit_purchase_order:{type:Boolean,default:false},

        view_inventory:{type:Boolean,default:false},
        add_inventory:{type:Boolean,default:false},
        edit_inventory:{type:Boolean,default:false},

        view_orders:{type:Boolean,default:false},
        add_orders:{type:Boolean,default:false},
        edit_orders:{type:Boolean,default:false},

        view_sales_order:{type:Boolean,default:false},
        add_sales_order:{type:Boolean,default:false},
        edit_sales_order:{type:Boolean,default:false},

        view_sample:{type:Boolean,default:false},
        add_sample:{type:Boolean,default:false},
        edit_sample:{type:Boolean,default:false},

        view_dispatch:{type:Boolean,default:false},
        add_dispatch:{type:Boolean,default:false},
        edit_dispatch:{type:Boolean,default:false},

        view_payment:{type:Boolean,default:false},
        add_payment:{type:Boolean,default:false},
        edit_payment:{type:Boolean,default:false},

        view_payout:{type:Boolean,default:false},
        add_payout:{type:Boolean,default:false},
        edit_payout:{type:Boolean,default:false},
        
        view_ticket:{type:Boolean,default:false},
        add_ticket:{type:Boolean,default:false},
        edit_ticket:{type:Boolean,default:false},
    },
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date, default: null },
});

export default mongoose.model("RoleModel", RoleSchema, "roles");
