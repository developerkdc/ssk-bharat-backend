import mongoose from "mongoose";
import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import fs from "fs";


class Branches {
    #branchSchema
    #modal
    #refernceName
    #modalName
    #collectionName
    constructor(modalName, collectionName,refernceName) {
        this.#branchSchema = new mongoose.Schema({
            [`${modalName}Id`]: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, `${modalName} Id is required`],
                ref:refernceName
            },
            branch_name: {
                type: String,
                trim: true,
                required: [true, "branch name is required"]
            },
            branch_onboarding_date: {
                type: Date,
                default: Date.now
            },
            branch_status:{
                type:Boolean,
                default:true,
            },
            isPrimary: {
                type: Boolean,
                default: false
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
                                required: [true, "gst no is required"]
                            },
                            gst_image: {
                                type: String,
                                default: null
                            }
                        }
                    },
                    bank_details: {
                        type: {
                            bank_name: {
                                type: String,
                                trim: true,
                                required: [true, "bank name is required"]
                            },
                            account_no: {
                                type: String,
                                trim: true,
                                required: [true, "account no is required"]
                            },
                            confirm_account_no: {
                                type: String,
                                trim: true,
                                validate: {
                                    validator: function (value) {
                                        return value === this.account_no;
                                    },
                                    message: "confirm account is not matched"
                                },
                                required: [true, "confirm account no is required"]
                            },
                            ifsc_code: {
                                type: String,
                                trim: true,
                                required: [true, "ifsc code is required"]
                            },
                            passbook_image: {
                                type: String,
                                default: null
                            }
                        }
                    }
                }
            },
            branch_address: {
                address: {
                    type: String,
                    trim: true,
                    required: [true, "address is required"]
                },
                location: {
                    type: String,
                    trim: true,
                    required: [true, "location is required"]
                },
                area: {
                    type: String,
                    trim: true,
                    required: [true, "area is required"]
                },
                district: {
                    type: String,
                    trim: true,
                    required: [true, "district is required"]
                },
                taluka: {
                    type: String,
                    trim: true,
                    required: [true, "taluka is required"]
                },
                state: {
                    type: String,
                    trim: true,
                    required: [true, "state is required"]
                },
                city: {
                    type: String,
                    trim: true,
                    required: [true, "city is required"]
                },
                country: {
                    type: String,
                    trim: true,
                    required: [true, "country is required"]
                },
                pincode: {
                    type: String,
                    trim: true,
                    required: [true, "pincode is required"]
                }
            },
            contact_person: [
                {
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
                    role: {
                        type: String,
                        trim: true,
                    },
                    primary_email: {
                        type: String,
                        trim: true,
                        validate: {
                            validator: function (value) {
                                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                            },
                            message: "primary invalid email Id"
                        },
                        required: [true, "primary email is required"]
                    },
                    secondary_email: {
                        type: String,
                        trim: true,
                        validate: {
                            validator: function (value) {
                                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                            },
                            message: "secondary invalid email Id"
                        }
                    },
                    primary_mobile: {
                        type: String,
                        trim: true,
                        required: [true, "primary_mobile Number is required"]
                    },
                    secondary_mobile: {
                        type: String,
                        trim: true,
                    },
                    isPrimary: {
                        type: Boolean,
                        default: false
                    }
                }
            ],
            created_at: {
                type: Date,
                default: Date.now
            }
        });
        this.#branchSchema.pre("save", function (next) {
            if (this.contact_person.length <= 0) {
                return next(new ApiError("Atleast one contact details should be provide", 400));
            }
            next()
        });
        this.#refernceName = refernceName
        this.#collectionName = collectionName;
        this.#modalName = modalName
        this.#modal = mongoose.model(this.#collectionName, this.#branchSchema)
    }
    getAllBranchCompany = catchAsync(async (req, res, next) => {
        const { filter = {} } = req.body;
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        const data = await this.#modal.aggregate([
            {
                $match: filter
            },
            {
                $limit: limit
            },
            {
                $skip: (page * limit) - limit
            },
            {
                $lookup: {
                    from: this.#refernceName,
                    localField: `${this.#modalName}Id`,
                    foreignField: "_id",
                    as: `${this.#modalName}Id`
                }
            },
            {
                $unwind: `$${this.#modalName}Id`
            },
        ]).sort(req.query.sort || "-created_at")
        return res.status(200).json({
            statusCode: 200,
            status: "Success",
            length: data.length,
            data: {
                branch: data
            },
            message: `${this.#modalName} All Branch`
        })
    })
    getBranchOfCompany = catchAsync(async (req, res, next) => {
        const branch = await this.#modal.find({ [`${this.#modalName}Id`]: req.params.companyId }).populate(`${this.#modalName}Id`);
        return res.status(200).json({
            statusCode: 200,
            status: "Success",
            data: {
                branch: branch
            },
            message: `${this.#modalName} All Branch`
        })
    })
    addBranch = catchAsync(async (req, res, next) => {
        const branch = await this.#modal.create(req.body);
        return res.status(201).json({
            statusCode: 201,
            status: "Created",
            data: {
                branch: branch
            },
            message: `${this.#modalName} Branch created`
        })
    });
    updateBranch = catchAsync(async (req, res, next) => {
        const { branchId } = req.query;
        const { contact_person, ...data } = req.body;
        if (!branchId) {
            return next(new ApiError("branch id is required"))
        }
        const updateBranch = await this.#modal.findByIdAndUpdate({ _id: branchId, [`${this.#modalName}Id`]: req.params.companyId }, {
            $set: data
        }, { new: true });

        return res.status(200).json({
            statusCode: 200,
            status: "Updated",
            data: {
                branch: updateBranch
            },
            message: `${this.#modalName} Branch updated`
        })
    })
    uploadDocument = (fileName) => {
        return catchAsync(async (req, res, next) => {
            const { branchId, companyId } = req.params;
            const branch = await this.#modal.findOne({ _id: branchId, [`${this.#modalName}Id`]: companyId });
            const images = {};
            console.log(req.files)
            if (req.files) {
                for (let i in req.files) {
                    images[i] = req.files[i][0].filename;
                    if (fs.existsSync(`${fileName}/${i.split("_")[0] === "passbook" ? branch?.kyc?.bank_details[i] : branch?.kyc[i?.split("_")[0]][i]}`)) {
                        fs.unlinkSync(`${fileName}/${i.split("_")[0] === "passbook" ? branch?.kyc?.bank_details[i] : branch?.kyc[i?.split("_")[0]][i]}`)
                    }
                }
            }
            const updatedImages = await this.#modal.updateOne({ _id: branchId, [`${this.#modalName}Id`]: companyId }, {
                $set: {
                    "kyc.pan.pan_image": images?.pan_image,
                    "kyc.gst.gst_image": images?.gst_image,
                    "kyc.bank_details.passbook_image": images?.passbook_image
                }
            });

            return res.status(200).json({
                statusCode: 200,
                status: "Updated",
                data: {
                    KYC_Images: updatedImages
                },
                message: "images has been uploaded"
            })

        })
    }
    AddContact = catchAsync(async (req, res, next) => {
        const { companyId, branchId } = req.params
        if (!companyId || !branchId) {
            return next(new ApiError("companyId or BranchId is required", 400));
        }
        const addConatct = await this.#modal.findByIdAndUpdate({ _id: branchId, [`${this.#modalName}Id`]: companyId }, {
            $push: {
                contact_person: req.body
            }
        }, { runValidators: true, new: true });

        return res.status(201).json({
            statusCode: 201,
            status: "Created",
            data: {
                branch: addConatct
            },
            message: "Branch contact created"
        })
    })
    UpdateContact = catchAsync(async (req, res, next) => {
        const { companyId, branchId } = req.params;
        const { first_name, last_name, role, primary_email, secondary_email, primary_mobile, secondary_mobile, isPrimary } = req.body;
        if (!req.query.contactId) {
            return next(new ApiError("contactId is required", 400));
        }
        const updatedContact = await this.#modal.findByIdAndUpdate({ _id: branchId, [`${this.#modalName}Id`]: companyId, "contact_person._id": req.query.contactId }, {
            $set: {
                "contact_person.$[e].first_name": first_name,
                "contact_person.$[e].last_name": last_name,
                "contact_person.$[e].role": role,
                "contact_person.$[e].primary_email": primary_email,
                "contact_person.$[e].secondary_email": secondary_email,
                "contact_person.$[e].primary_mobile": primary_mobile,
                "contact_person.$[e].secondary_mobile": secondary_mobile,
                "contact_person.$[e].isPrimary": isPrimary,
            }
        }, {
            arrayFilters: [{ "e._id": req.query.contactId }],
            runValidators: true,
            new: true
        })

        return res.status(200).json({
            statusCode: 200,
            status: "Updated",
            data: {
                branch: updatedContact
            },
            message: "Branch contact updated"
        })
    })
}
export default Branches