import mongoose from "mongoose";
import DynamicModel from "../../Utils/DynamicModel";

const LogSchema = new mongoose.Schema({
    userData: {
        type: {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "user id is required"]
            },
            name: {
                type: String,
                trim: true,
                default: null
            },
            email_id: {
                type: String,
                trim: true,
                validate: {
                    validator: function (value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    },
                    message: "invalid email Id"
                }
            },
            employee_id: {
                type: String,
                trim: true,
                required: [true, "employee id is required"]
            },
        },
        // required: [true, "User Data is required"]
    },
    data: { type: mongoose.Schema.Types.Mixed }
});

const LogSchemaFunction = function (modelName, collectionToWatch) {
    const Model = DynamicModel(`${modelName}logs`, LogSchema);

    const pipeline = [
        {
            $match: {
                $or: [
                    { operationType: "insert" },
                    { operationType: "update" }
                ]
            }
        }
    ]

    const ChangeStream = collectionToWatch.watch(pipeline,{ fullDocument: 'updateLookup' });
    // ChangeStream.close()
    ChangeStream.on("change", async (change) => {
        console.log("Change event triggered:",change.documentKey._id)
        const user = change?.fullDocument?.approver?.updated_by
        const DataLog = await Model.create({
            userData:user,
            data:change
        });
        // console.log(DataLog)
    });
    

}

export default LogSchemaFunction;