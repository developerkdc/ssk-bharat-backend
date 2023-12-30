import mongoose from "mongoose"
import catchAsync from "../../../Utils/catchAsync"
import crypto from "crypto";
import bcrypt from "bcrypt"
import userAndApprovals from "../../../database/utils/approval.schema";

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
            approval: userAndApprovals,
            created_at: {
                type: Date,
                default: Date.now
            },
            updated_at: { type: Date, default: Date.now },
        });
        this.#collectionName = collectionName;
        this.#modalName = modalName
        this.#modal = mongoose.model(this.#collectionName, this.#Schema)
    }
    GetCompany = catchAsync(async (req, res, next) => {
        const modalName = await this.#modal.find({});
        return res.status(201).json({
            statusCode: 200,
            status: "Success",
            length: modalName.length,
            data: {
                [this.#modalName]: modalName
            },
            message: `All ${this.#modalName}`
        })
    })
    GetCompanyById = catchAsync(async (req, res, next) => {
        const modalName = await this.#modal.findOne({ _id: req.params.id });
        return res.status(201).json({
            statusCode: 200,
            status: "Success",
            data: {
                [this.#modalName]: modalName
            },
        })
    })
    AddCompany = catchAsync(async (req, res, next) => {
        
        let protectedPassword;

        if(!req.baseUrl.endsWith("sskcompany") && !req.baseUrl.endsWith("suppliers")){
            let Password = crypto.randomBytes(8).toString("hex");
            protectedPassword = bcrypt.hashSync(Password, 12);
        }

        const addData = await this.#modal.create({ ...req.body, password: protectedPassword });
        return res.status(201).json({
            statusCode: 201,
            status: "Success",
            data: {
                [this.#modalName]: addData
            },
            message: `${this.#modalName} has created`
        })
    })
    UpdateCompany = catchAsync(async (req, res, next) => {
        const { company_name, onboarding_date, company_status, approver_one, approver_two } = req.body;
        const { id } = req.params;
        const updateData = await this.#modal.findByIdAndUpdate({ _id: id }, {
            $set: {
                company_name,
                company_status,
                onboarding_date,
                "approver_one.isApprove": approver_one?.isApprove,
                "approver_two.isApprove": approver_two?.isApprove,
                updated_at:Date.now()
            }
        }, { new: true });

        return res.status(200).json({
            statusCode: 200,
            status: "Updated",
            data: {
                [this.#modalName]: updateData
            },
            message: `${this.#modalName} has Updated`
        })
    })
}
export default CompanyMaster;