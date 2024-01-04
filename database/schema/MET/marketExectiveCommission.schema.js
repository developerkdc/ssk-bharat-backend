import mongoose from "mongoose";
import SchemaFunction from "../../../controllers/HelperFunction/SchemaFunction";

const marketExectiveCommissionSchema = SchemaFunction(new mongoose.Schema({
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        trim:true,
        required:[true,"retailer id is required"],
        refPath:"current_data.companyType"
    },
    marketExecutiveId:{
        type:mongoose.Schema.Types.ObjectId,
        trim:true,
        ref:"marketexecutives",
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
    onBoardingDate:{
        type:Date,
        default:Date.now
    },
    commissionPercentage:{
        type:Number,
        default:0
    }
}));

const marketExectiveCommissionModel = mongoose.model('marketExectiveCommission',marketExectiveCommissionSchema);
export default marketExectiveCommissionModel;