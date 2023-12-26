import mongoose from "mongoose";

const marketExectiveCommissionSchema = new mongoose.Schema({
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        trim:true,
        required:[true,"retailer id is required"],
        refPath:"collectionRef"
    },
    marketExecutiveId:{
        type:mongoose.Schema.Types.ObjectId,
        trim:true,
        ref:"marketexecutives",
        required:[true,"market executive id is required"]
    },
    collectionRef:{
        type:String,
        enum:{
            values:["retailers","offlinestores"],
            message:"collection ref must contain retailers or offlinestores"
        }
    },
    onBoardingDate:{
        type:Date,
        default:Date.now
    },
    commissionPercentage:{
        type:Number,
        default:0
    }
});

const marketExectiveCommissionModel = mongoose.model('marketExectiveCommission',marketExectiveCommissionSchema);
export default marketExectiveCommissionModel;