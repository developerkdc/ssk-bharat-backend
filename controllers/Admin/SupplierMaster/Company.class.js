import mongoose from "mongoose"
import catchAsync from "../../../Utils/catchAsync"

class CompanyMaster {
    #Schema
    #collectionName
    #modalName
    #modal
    constructor(modalName, collectionName) {
        this.#Schema = new mongoose.Schema({
            company_name: {
                type: String,
                minlength: [2, "Length should be greater than two"],
                maxlength: [25, "Length should be less than or equal to 25"],
                trim: true,
                required: [true, "Company name is required"]
            },
            onboarding_date: {
                type: Date,
                default: Date.now
            },
            password: {
                type: String,
                trim: true,
                default: null
            },
            company_status: {
                type: Boolean,
                default: false
            },
            created_by: {
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
                    email: {
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
                required: [true, "created by is required"]
            },
            approver_one: {
                type: {
                    user_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Users"
                    },
                    name: {
                        type: String,
                        trim: true,
                    },
                    email_id: {
                        type: String,
                        validate: {
                            validator: function (value) {
                                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                            },
                            message: "approver one invalid email Id"
                        }
                    },
                    employee_id: String,
                    isApprove: {
                        type: Boolean,
                        default: false
                    }
                },
                default: null,
            },
            approver_two: {
                type: {
                    user_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Users"
                    },
                    name: String,
                    email_id: {
                        type: String,
                        validate: {
                            validator: function (value) {
                                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                            },
                            message: "approver two invalid email Id"
                        }
                    },
                    employee_id: String,
                    isApprove: {
                        type: Boolean,
                        default: false
                    }
                },
                default: null,
            },
            created_at: {
                type: Date,
                default: Date.now
            }
        });
        this.#collectionName = collectionName;
        this.#modalName = modalName
        this.#modal = mongoose.model(this.#collectionName, this.#Schema)
    }
    GetSupplier = catchAsync(async (req, res, next) => {
        const modalName = await this.#modal.find({ company_status: true });
        return res.status(201).json({
            statusCode: 200,
            status: "Success",
            length: modalName.length,
            data: {
                supplier: modalName
            },
            message: "All Supplier"
        })
    })
    GetSupplierById = catchAsync(async (req, res, next) => {
        const modalName = await this.#modal.findOne({ _id: req.params.id, company_status: true });
        return res.status(201).json({
            statusCode: 200,
            status: "Success",
            data: {
                supplier: modalName
            },
        })
    })
    AddSupplier = catchAsync(async (req, res, next) => {
        const addSupplier = await this.#modal.create(req.body);
        return res.status(201).json({
            statusCode: 201,
            status: "Success",
            data: {
                supplier: addSupplier
            },
            message: "Supplier has created"
        })
    })
    UpdateSupplier = catchAsync(async (req, res, next) => {
        const { company_name, onboarding_date, company_status, approver_one, approver_two } = req.body;
        const { id } = req.params;
        const updatedSupplier = await this.#modal.findByIdAndUpdate({ _id: id }, {
            $set: {
                company_name,
                company_status,
                onboarding_date,
                "approver_one.isApprove": approver_one?.isApprove,
                "approver_two.isApprove": approver_two?.isApprove,
            }
        }, { new: true });

        return res.status(200).json({
            statusCode: 200,
            status: "Updated",
            data: {
                supplier: updatedSupplier
            },
            message: "Supplier has Updated"
        })
    })
}
export default CompanyMaster;