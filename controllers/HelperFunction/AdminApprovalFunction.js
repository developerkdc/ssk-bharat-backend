import mongoose from "mongoose";
import ApiError from "../../Utils/ApiError";

const adminApprovalFunction = async function (obj) {
    const { module, user, documentId } = obj
    if (!module) return next(new ApiError("please provide module name", 400));

    if (user.current_data.role_id.role_name === "Admin") {
        const model = mongoose.model(module);
        const data = await model.findOne({ _id: documentId });

        if (!data) return next(new ApiError("the document does not exits", 400));

        let poModel;
        if (module === "orders" && data.current_data.order_type === "offlinestores") {
            poModel = storePOModel
        }

        let approvalList = await model.updateOne({ _id: documentId }, {
            $set: {
                "proposed_changes.status": true,
                current_data: Object.assign(data.proposed_changes, { status: true })
            }
        });

        if (module === "orders" && poModel) {
            if (approvalList.acknowledged && approvalList.modifiedCount > 0) {
                const companyPOStatus = await poModel.updateOne({ _id: data.current_data.purchase_order_id }, {
                    $set: {
                        status: true
                    }
                })
            }
        }
    }
}

export default adminApprovalFunction