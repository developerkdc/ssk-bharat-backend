import mongoose from "mongoose"
import catchAsync from "../../../../Utils/catchAsync";
import crypto from "crypto";
import bcrypt from "bcrypt"
import companyAndApprovals from "../../../../database/utils/approval.schema";


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
            approval: companyAndApprovals,
            created_at: {
                type: Date,
                default: Date.now
            },
            updated_at: { type: Date, default: Date.now },
        });
        this.#Schema.methods.jwtToken = function (next) {
            try {
                return jwt.sign(
                    { [modalName]: this._id, companyName: this.company_name },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES }
                );
            } catch (error) {
                return next(error)
            }
        }
        this.#collectionName = collectionName;
        this.#modalName = modalName
        this.#modal = mongoose.model(this.#collectionName, this.#Schema)
    }
    Logincompany = catchAsync(async (req, res, next) => {
        const { companyname, password } = req.body;
        const company = await this.#modal.findOne({ primary_email_id: companyname });
        if (!company) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const passwordMatch = await bcrypt.compare(password, company.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = company.jwtToken(next)

        return res.status(200).cookie("token", token).cookie("companyId", company.id).json({
            statusCode: 200,
            token: token,
            message: "Login success",
        });
    });
    ChangePassword = catchAsync(async (req, res) => {
        const companyId = req.params.companyId;
        const { currentPassword, newPassword } = req.body;
        const saltRounds = 10;
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }
        const company = await this.#modalName.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "company not found" });
        }
        // Check if the current password matches
        const isPasswordValid = await bcrypt.compare(currentPassword, company.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        company.password = hashedPassword;
        const updatedcompany = await company.save();
        res.json({
            statusCode: 200,
            status: "Success",
            data: {
                company: updatedcompany,
            },
            message: "Password updated successfully",
        });
    });
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

        if (!req.baseUrl.endsWith("sskcompany") && !req.baseUrl.endsWith("suppliers")) {
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
                updated_at: Date.now()
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