import mongoose from "mongoose";
import DynamicModel from "../../Utils/DynamicModel";
import events from "events"

export const eventEmitter = new events.EventEmitter();

const LogSchema = new mongoose.Schema({
    userData: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        emailId: {
            type: String,
            required: true,
        },
        employeeId: {
            type: String,
            required: true,
        },
        mobileNo: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    data: { type: mongoose.Schema.Types.Mixed }
});

const LogSchemaFunction = function (modelName, collectionToWatch) {
    let user = {
        userId: "6582917c9ea18fbaac4e7ae6",
        emailId: "a@gmail.com",
        employeeId: "123456",
        mobileNo:"1234567890",
        name: "Abhishek Vishwakarma",
    }

    eventEmitter.on("loginPersonData",(userData)=>{
        user = userData
    })
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
    ChangeStream.on("change", async (change) => {
        const DataLog = new Model({
            userData:user,
            data:change
        });
        await DataLog.save();
    });

    
}

export default LogSchemaFunction;