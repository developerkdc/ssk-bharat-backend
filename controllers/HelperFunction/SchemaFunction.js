import mongoose from "mongoose";
import userAndApprovals from "../../database/utils/approval.schema";

const SchemaFunction = function (Schema) {
    Schema.add({
        status: {
            type: Boolean,
            default: false
        }
    });
    return new mongoose.Schema({
        current_data: {
            type: Schema,
            required: [true, "current data is required"]
        },
        proposed_changes: {
            type: Schema,
            default: function () {
                return this.current_data || {}
            }
        },
        approver: userAndApprovals,
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        deleted_at: { type: Date, default: null },
    })
};

export default SchemaFunction;
