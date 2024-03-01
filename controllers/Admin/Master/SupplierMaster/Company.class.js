import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchAsync from "../../../../Utils/catchAsync";
import companyAndApprovals from "../../../../database/utils/approval.schema";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import SchemaFunction from "../../../HelperFunction/SchemaFunction";
import { approvalData } from "../../../HelperFunction/approvalFunction";
import LogSchemaFunction from "../../../../database/utils/Logs.schema";
import createdBy from "../../../../database/utils/createdBy.schema";
import { createdByFunction } from "../../../HelperFunction/createdByfunction";
import adminApprovalFunction from "../../../HelperFunction/AdminApprovalFunction";
import ApiError from "../../../../Utils/ApiError";

class CompanyMaster {
  #Schema;
  #collectionName;
  #branchCollectionName;
  #modalName;
  #modal;
  constructor(modalName, collectionName, branchCollectionName) {
    this.#Schema = SchemaFunction(new mongoose.Schema({
      username: {
        type: String,
        required: [function () {
          return this.company_type === "retailers" || this.company_type === "offlinestores";
        }, "Username is required"]
      },
      company_name: {
        type: String,
        minlength: [2, "Length should be greater than two"],
        maxlength: [25, "Length should be less than or equal to 25"],
        trim: true,
        required: [true, "Company name is required"],
      },
      company_type: {
        type: String,
        required: [true, "company Type is required"],
        enum: {
          values: ["retailers", "offlinestores", "suppliers", "sskcompanies"],
          message: "invalid {VALUE}"
        },
        trim: true,
        lowercase: true,
        default: collectionName.toLowerCase()
      },
      isActive: {
        type: Boolean,
        default: true
      },
      onboarding_date: {
        type: Date,
        default: Date.now,
      },
      pan: {
        type: {
          pan_no: {
            type: String,
            trim: true,
            // unique: true,
            required: [true, "pan no is required"],
          },
          pan_image: {
            type: String,
            default: null,
          },
        },
      },
      // register_mobile_no: {
      //   type: String,
      //   minlength: [10, "Length should be greater or equal to 10"],
      //   maxlength: [10, "Length should be less than or equal to 10"],
      //   trim: true,
      //   unique: true,
      //   required: [true, "register mobile no is required"]
      // },
      password: {
        type: String,
        trim: true,
        default: null,
      },
      primaryBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: branchCollectionName,
        default: null
      },
      inventorySchema: {
        type: String,
        lowercase: true,
        default: function () {
          if (this.company_type === "retailers" || this.company_type === "offlinestores") {
            return `${this.company_type}_${this.company_name}_${this.parent()._id.toString().slice(-5)}`
          } else {
            return null
          }
        }
      },
      billingSchema: {
        type: String,
        lowercase: true,
        default: function () {
          if (this.company_type === "retailers" || this.company_type === "offlinestores") {
            return `${this.company_type}_billing_${this.company_name}_${this.parent()._id.toString().slice(-5)}`
          } else {
            return null
          }
        }
      },
      created_by: {
        type: createdBy,
        required: [true, "created by is required"]
      }
    }))
    this.#Schema.index({ "current_data.pan.pan_no": 1 }, { unique: true })
    this.#Schema.index({ "current_data.username": 1 }, { unique: true })
    this.#Schema.methods.jwtToken = function (next) {
      try {
        return jwt.sign(
          { [modalName]: this._id, companyName: this.current_data.company_name },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES }
        );
      } catch (error) {
        return next(error);
      }
    };
    this.#collectionName = collectionName;
    this.#branchCollectionName = branchCollectionName;
    this.#modalName = modalName;
    this.#modal = mongoose.model(this.#collectionName, this.#Schema);
    LogSchemaFunction(this.#collectionName, this.#modal);
  }
  GetCompany = catchAsync(async (req, res, next) => {
    const { string, boolean, numbers } = req?.body?.searchFields || {};
    const search = req.query.search || "";
    const { filters = {} } = req.body;
    const {
      page = 1,
      limit = 10,
      sortBy = "company_name",
      sort = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    let searchQuery = {};
    if (search != "" && req?.body?.searchFields) {
      const searchdata = dynamicSearch(search, boolean, numbers, string);
      if (searchdata?.length == 0) {
        return res.status(404).json({
          statusCode: 404,
          status: "failed",
          data: {
            data: [],
          },
          message: "Results Not Found",
        });
      }
      searchQuery = searchdata;
    }

    //total pages
    const totalDocuments = await this.#modal.countDocuments({
      ...filters,
      ...searchQuery,
      "current_data.status": true,
    });
    const totalPages = Math.ceil(totalDocuments / limit);

    const modalName = await this.#modal
      .find({ ...filters, ...searchQuery, "current_data.status": true })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sort });

    return res.status(201).json({
      statusCode: 200,
      status: "Success",
      totalPages: totalPages,
      length: modalName.length,
      data: {
        [this.#modalName]: modalName,
      },
      message: `All ${this.#modalName}`,
    });
  });
  GetCompanyById = catchAsync(async (req, res, next) => {
    const modalName = await this.#modal.findOne({ _id: req.params.id }).populate({
      path: "current_data.primaryBranch",
      select: "_id current_data"
    });
    return res.status(200).json({
      statusCode: 200,
      status: "Success",
      data: {
        [this.#modalName]: modalName,
      },
    });
  });
  GetCompanyList = catchAsync(async (req, res, next) => {
    const modalName = await this.#modal.find({ "current_data.isActive": true, "current_data.status": true }, { "company_name": "$current_data.company_name", "pan_no": "$current_data.pan.pan_no" });
    return res.status(201).json({
      statusCode: 200,
      status: "Success",
      data: {
        [this.#modalName]: modalName,
      },
    });
  });
  AddCompany = catchAsync(async (req, res, next) => {
    const { approver, inventorySchema, billingSchema, company_name, onboarding_date, pan_no, username } = req.body;
    const user = req.user;
    let protectedPassword;
    let Password;
    let pan_image;
    if (
      !req.baseUrl.endsWith("sskcompany") &&
      !req.baseUrl.endsWith("suppliers")
    ) {
      Password = crypto.randomBytes(8).toString("hex");
      protectedPassword = bcrypt.hashSync(Password, 12);
    }

    if (req.file) {
      pan_image = req.file.path
    }

    const addData = await this.#modal.create({
      current_data: {
        username,
        company_name,
        onboarding_date,
        pan: {
          pan_no: pan_no,
          pan_image: pan_image,
        },
        password: protectedPassword,
        created_by: createdByFunction(user)
      },
      approver: approvalData(user)
    });


    adminApprovalFunction({
      module: this.#collectionName,
      user: user,
      documentId: addData.id
    })

    // await sendEmail({
    //   email: addData.current_data?.contact_person_details?.primary_email_id,
    //   subject: `Welcome ${addME.current_data?.contact_person_details?.first_name} ${addME.current_data?.contact_person_details?.last_name}`,
    //   message:welcomeMessage({
    //     email:addME.current_data?.contact_person_details?.primary_email_id,
    //     password:Password
    //   }),
    // });


    return res.status(201).json({
      statusCode: 201,
      status: "Success",
      data: {
        [this.#modalName]: addData,
      },
      message: `${this.#modalName} has created`,
    });
  });
  UpdateCompany = catchAsync(async (req, res, next) => {
    const {
      company_name,
      onboarding_date,
      isActive,
      pan_no
    } = req.body;
    const { id } = req.params;
    const user = req.user;
    let pan_image;
    if (req.file) {
      pan_image = req.file.path
    }
    const updateData = await this.#modal.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          "proposed_changes.company_name": company_name,
          "proposed_changes.status": false,
          "proposed_changes.isActive": isActive,
          "proposed_changes.onboarding_date": onboarding_date,
          "proposed_changes.pan.pan_no": pan_no,
          "proposed_changes.pan.pan_image": pan_image,
          approver: approvalData(user),
          updated_at: Date.now(),
        },
      },
      { new: true }
    );

    adminApprovalFunction({
      module: this.#collectionName,
      user: user,
      documentId: id
    })

    return res.status(200).json({
      statusCode: 200,
      status: "Updated",
      data: {
        [this.#modalName]: updateData,
      },
      message: `${this.#modalName} has Updated`,
    });
  });
  setPrimaryBranch = catchAsync(async (req, res, next) => {
    const { companyId, branchId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(branchId)) return next(new ApiError(`${branchId} this is not valid Id`, 400));

    const user = req.user;
    if (!user) return next(new ApiError("please Login and try again", 404))

    const branchData = await mongoose.model(this.#branchCollectionName).findOne({
      _id: branchId,
      [`current_data.${this.#modalName}Id`]: companyId,
      "proposed_changes.isActive": true,
      "proposed_changes.status": true,
    });
    if (!branchData) return next(new ApiError(`Branch is not exits`, 404))

    const setPrimary = await this.#modal.updateOne({ _id: companyId }, {
      $set: {
        "proposed_changes.primaryBranch": branchId,
        approver: approvalData(user),
        updated_at: Date.now(),
      }
    })

    if (!setPrimary.acknowledged && setPrimary.modifiedCount === 0) {
      return next(new ApiError("Unable to set primary branch", 400))
    }

    adminApprovalFunction({
      user: user,
      documentId: companyId,
      module: this.#collectionName
    })

    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: {
        [this.#modalName]: setPrimary
      },
      message: "Branch set as primary"
    })
  });
}
export default CompanyMaster;
