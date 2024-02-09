import mongoose from "mongoose";
import SchemaFunction from "../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../utils/Logs.schema";

const marketExectiveCommissionSchema = SchemaFunction(new mongoose.Schema({
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        trim:true,
        required:[true,"company id is required"],
        refPath:"current_data.companyType"
    },
    marketExecutiveId:{
        type:mongoose.Schema.Types.ObjectId,
        trim:true,
        ref:"MarketExecutive",
        required:[true,"market executive id is required"]
    },
    companyType:{
        type:String,
        enum:{
            values:["retailers","offlinestores"],
            message:"company type must contain retailers or offlinestores rather than {VALUE}"
        },
        required:[true,"company type is required"]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    onBoardingDate:{
        type:Date,
        default:Date.now
    },
    commissionPercentage:{
        type:Number,
        default:0
    }
}));

marketExectiveCommissionSchema.index({"current_data.companyId":1})
marketExectiveCommissionSchema.index({"current_data.marketExecutiveId":1})

const marketExectiveCommissionModel = mongoose.model('marketExectiveCommission',marketExectiveCommissionSchema);

// LogSchemaFunction("marketExectiveCommission", marketExectiveCommissionModel)

export default marketExectiveCommissionModel;