import mongoose from "mongoose";
import addressSchema from "../utils/address.schema";
import userAndApprovals from "../utils/approval.schema";
import bankDetailsSchema from "../utils/bankDetails.schema";

const nomineeSchema = new mongoose.Schema({
    nominee_name: {
        type: String,
        trim: true,
        default: null
    },
    nominee_dob: {
        type: Date,
        default: null
    },
    nominee_age: {
        type: String,
        trim: true,
        default: null
    },
    address: addressSchema,
    kyc: {
        type: {
            kyc_status: Boolean,
            pan: {
                type: {
                    pan_no: {
                        type: String,
                        trim: true,
                        required: [true, "pan no is required"]
                    },
                    pan_image: {
                        type: String,
                        default: null
                    }
                }
            },
            aadhar: {
                type: {
                    aadhar_no: {
                        type: String,
                        trim: true,
                        required: [true, "aadhar no is required"]
                    },
                    aadhar_image: {
                        type: String,
                        default: null
                    }
                }
            },
            bank_details: bankDetailsSchema
        }
    }
})

const insuranceSchema = new mongoose.Schema({
    policy_no: {
        type: String,
        trim: true,
        default: null
    },
    policy_image: {
        type: String,
        trim: true,
        default: null
    },
    policy_company_name: {
        type: String,
        trim: true,
        default: null
    },
    policy_date: {
        type: Date,
        default: null
    },
    policy_amount: {
        type: String,
        trim: true,
        default: null
    },
    renewal_date: {
        type: Date,
        default: null
    },
})

const MarketExecutiveSchema = new mongoose.Schema({
    company_details: {
        companyName: {
            type: String,
            trim: true,
            default: null
        }
    },
    contact_person_details: {
        first_name: {
            type: String,
            trim: true,
            required: [true, "first name is required"]
        },
        last_name: {
            type: String,
            trim: true,
            required: [true, "last name is required"]
        },
        blood_group: {
            type: String,
            trim: true,
            default: null
        },
        primary_email_id: {
            type: String,
            trim: true,
            required: [true, "first name is required"]
        },
        secondary_email_id: {
            type: String,
            trim: true,
            default: null,
        },
        primary_mobile_no: {
            type: String,
            trim: true,
            required: [true, "first name is required"]
        },
        secondary_mobile_no: {
            type: String,
            trim: true,
            default: null,
        },
        onboarding_date: {
            type: Date,
            default: Date.now
        },
        role_assign: {
            type: String,
            trim: true,
            default: null,
        },
    },
    kyc: {
        type: {
            kyc_status: Boolean,
            pan: {
                type: {
                    pan_no: {
                        type: String,
                        trim: true,
                        required: [true, "pan no is required"]
                    },
                    pan_image: {
                        type: String,
                        default: null
                    }
                }
            },
            gst: {
                type: {
                    gst_no: {
                        type: String,
                        trim: true,
                        default: null
                    },
                    gst_image: {
                        type: String,
                        trim: true,
                        default: null
                    },
                }
            },
            aadhar: {
                type: {
                    aadhar_no: {
                        type: String,
                        trim: true,
                        required: [true, "aadhar no is required"]
                    },
                    aadhar_image: {
                        type: String,
                        default: null
                    }
                }
            },
            bank_details: {
                type: bankDetailsSchema
            }
        }
    },
    insurance: insuranceSchema,
    nominee: [
        nomineeSchema
    ],
    address: addressSchema,
    approvals: userAndApprovals
});

const MarketExecutiveModel = mongoose.model("MarketExecutive", MarketExecutiveSchema);
export default MarketExecutiveModel
