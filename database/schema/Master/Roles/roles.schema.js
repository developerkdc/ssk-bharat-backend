import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import createdBy from "../../../utils/createdBy.schema";
import LogSchemaFunction from "../../../utils/Logs.schema";

const RoleSchema = SchemaFunction(
  new mongoose.Schema({
    role_name: {
      type: String,
      min: 2,
      max: 25,
      required: [true, "Role Name is required"],
      unique: true,
      trim:true
    },
    permissions: {
      user: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      roles: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      category: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      unit: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      gst: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      hsn_code: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      product: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      suppliers: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      sskcompany: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      marketExecutive: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      retailer: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      offlineStore: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      ssk_po: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      inventory: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      sampleTracking: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      order: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      product: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      salesOrder: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      refund: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      dispatch: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      tds: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      term_days: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      faq: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      ticket: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      payments: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
      payouts: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: createdBy,
      required: [true, "created by is required"],
    },
  })
);

const rolesModel = mongoose.model("roles", RoleSchema);
LogSchemaFunction("roles", rolesModel);

export default rolesModel;
