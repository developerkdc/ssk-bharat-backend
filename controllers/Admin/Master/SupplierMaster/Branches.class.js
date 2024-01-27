import mongoose, { Schema } from "mongoose";
import ApiError from "../../../../Utils/ApiError";
import catchAsync from "../../../../Utils/catchAsync";
import fs from "fs";
import userAndApprovals from "../../../../database/utils/approval.schema";
import { approvalData } from "../../../HelperFunction/approvalFunction";
import SchemaFunction from "../../../HelperFunction/SchemaFunction";
import { dynamicSearch } from "../../../../Utils/dynamicSearch";
import LogSchemaFunction from "../../../../database/utils/Logs.schema";
import adminApprovalFunction from "../../../HelperFunction/AdminApprovalFunction";

class Branches {
  #branchSchema;
  #modal;
  #refernceName;
  #modalName;
  #collectionName;
  constructor(modalName, collectionName, refernceName) {
    this.#branchSchema = SchemaFunction(
      new mongoose.Schema({
        [`${modalName}Id`]: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, `${modalName} Id is required`],
          ref: refernceName,
        },
        branch_name: {
          type: String,
          trim: true,
          lowercase: true,
          required: [true, "branch name is required"],
        },
        branch_onboarding_date: {
          type: Date,
          default: Date.now,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        kyc: {
          type: {
            kyc_status: {
              type: Boolean,
              default: false
            },
            pan: {
              type: {
                pan_no: {
                  type: String,
                  trim: true,
                  required: [true, "pan no is required"],
                },
                pan_image: {
                  type: String,
                  default: null,
                },
              },
            },
            gst: {
              type: {
                gst_no: {
                  type: String,
                  trim: true,
                  required: [true, "gst no is required"],
                },
                gst_image: {
                  type: String,
                  default: null,
                },
              },
            },
            bank_details: {
              type: {
                bank_name: {
                  type: String,
                  trim: true,
                  lowercase: true,
                  required: [true, "bank name is required"],
                },
                account_no: {
                  type: String,
                  trim: true,
                  required: [true, "account no is required"],
                },
                confirm_account_no: {
                  type: String,
                  trim: true,
                  validate: {
                    validator: function (value) {
                      return value === this.account_no;
                    },
                    message: "confirm account is not matched",
                  },
                  required: [true, "confirm account no is required"],
                },
                ifsc_code: {
                  type: String,
                  trim: true,
                  required: [true, "ifsc code is required"],
                },
                passbook_image: {
                  type: String,
                  default: null,
                },
              },
            },
          },
        },
        branch_address: {
          address: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "address is required"],
          },
          location: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "location is required"],
          },
          area: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "area is required"],
          },
          district: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "district is required"],
          },
          taluka: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "taluka is required"],
          },
          state: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "state is required"],
          },
          city: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "city is required"],
          },
          country: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "country is required"],
          },
          pincode: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "pincode is required"],
          },
        },
        contact_person: [
          {
            first_name: {
              type: String,
              trim: true,
              lowercase: true,
              required: [true, "first name is required"],
            },
            last_name: {
              type: String,
              trim: true,
              lowercase: true,
              required: [true, "last name is required"],
            },
            isActive: {
              type: Boolean,
              default: true
            },
            role: {
              type: String,
              trim: true,
              lowercase: true,
            },
            primary_email: {
              type: String,
              trim: true,
              validate: {
                validator: function (value) {
                  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: "primary invalid email Id",
              },
              required: [true, "primary email is required"],
            },
            secondary_email: {
              type: String,
              trim: true,
            },
            primary_mobile: {
              type: String,
              trim: true,
              lowercase: true,
              required: [true, "primary_mobile Number is required"],
            },
            secondary_mobile: {
              type: String,
              trim: true,
            },
            isPrimary: {
              type: Boolean,
              default: false,
            },
          },
        ],
      })
    );
    this.#branchSchema.pre("save", function (next) {
      if (this.current_data.contact_person.length <= 0) {
        return next(
          new ApiError("Atleast one contact details should be provide", 400)
        );
      }
      next();
    });
    this.#refernceName = refernceName;
    this.#collectionName = collectionName;
    this.#modalName = modalName;
    this.#modal = mongoose.model(this.#collectionName, this.#branchSchema);
    LogSchemaFunction(this.#collectionName, this.#modal)
  }
  getAllBranchCompany = catchAsync(async (req, res, next) => {
    const { string, boolean, numbers } = req?.body?.searchFields || {};
    const search = req.query.search || "";
    const { filters = {} } = req.body;
    const {
      sortBy = "created_at",
      sort = "desc",
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 10

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
    });
    const totalPages = Math.ceil(totalDocuments / limit);

    const data = await this.#modal
      .aggregate([
        {
          $match: { ...filters, ...searchQuery, "current_data.status": true },
        },
        {
          $sort: { [sortBy]: sort === "asc" ? 1 : -1 }
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: this.#refernceName,
            localField: `current_data.${this.#modalName}Id`,
            foreignField: "_id",
            as: `current_data.${this.#modalName}Id`,
          },
        },
        {
          $unwind: {
            path: `$current_data.${this.#modalName}Id`,
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
    return res.status(200).json({
      statusCode: 200,
      status: "Success",
      totalPages: totalPages,
      data: {
        branch: data,
      },
      message: `${this.#modalName} All Branch`,
    });
  });
  getBranchOfCompany = catchAsync(async (req, res, next) => {
    const branch = await this.#modal
      .find({ [`${this.#modalName}Id`]: req.params.companyId })
      .populate({
        path: `${this.#modalName}Id`,
        select: "current_data.company_name current_data.company_type"
      });
    return res.status(200).json({
      statusCode: 200,
      status: "Success",
      data: {
        branch: branch,
      },
      message: `${this.#modalName} All Branch`,
    });
  });
  GetBranchList = catchAsync(async (req, res, next) => {
    const modalName = await this.#modal.find({ "current_data.isActive": true, "current_data.status": true }, { "current_data.branch_name": 1, "current_data.company_name": 1 }).populate({
      path: `current_data.${this.#modalName}Id`,
      select: "current_data.company_name current_data.company_type"
    });
    return res.status(201).json({
      statusCode: 200,
      status: "Success",
      data: {
        [this.#modalName]: modalName,
      },
    });
  })
  addBranch = catchAsync(async (req, res, next) => {
    const { approver,kyc:{pan,gst,bank_details},...data } = req.body;
    const user = req.user;
    const branch = await this.#modal.create({ 
      current_data: {
        ...data,
        kyc:{
          pan: { pan_no: pan?.pan_no},
          gst: { gst_no: gst?.gst_no },
          bank_details: {
            bank_name: bank_details?.bank_name,
            account_no: bank_details?.account_no,
            confirm_account_no: bank_details?.confirm_account_no,
            ifsc_code: bank_details?.ifsc_code,
          }
        }
      }, 
      approver: approvalData(user), 
    });

    adminApprovalFunction({
      module: this.#collectionName,
      user: user,
      documentId: branch._id
    })
    return res.status(201).json({
      statusCode: 201,
      status: "Created",
      data: {
        branch: branch,
      },
      message: `${this.#modalName} Branch created`,
    });
  });
  updateBranch = catchAsync(async (req, res, next) => {
    const { branchId } = req.query;
    const { contact_person, approver, ...data } = req.body;
    if (!branchId) {
      return next(new ApiError("branch id is required"));
    }
    const updateBranch = await this.#modal.findOneAndUpdate(
      {
        _id: branchId,
        [`proposed_changes.${this.#modalName}Id`]: req.params.companyId,
      },
      {
        $set: {
          "proposed_changes.supplierId": data?.supplierId,
          "proposed_changes.branch_name": data?.branch_name,
          "proposed_changes.branch_onboarding_date": data?.branch_onboarding_date,
          "proposed_changes.kyc.pan.pan_no": data?.kyc?.pan?.pan_no,
          "proposed_changes.kyc.gst.gst_no": data?.kyc?.gst?.gst_no,
          "proposed_changes.kyc.kyc_status": data?.kyc?.kyc_status,
          "proposed_changes.kyc.bank_details.bank_name":
            data?.kyc?.bank_details?.bank_name,
          "proposed_changes.kyc.bank_details.account_no":
            data?.kyc?.bank_details?.account_no,
          "proposed_changes.kyc.bank_details.confirm_account_no":
            data?.kyc?.bank_details?.confirm_account_no,
          "proposed_changes.kyc.bank_details.ifsc_code":
            data?.kyc?.bank_details?.ifsc_code,
          "proposed_changes.branch_address.address":
            data?.branch_address?.address,
          "proposed_changes.branch_address.location":
            data?.branch_address?.location,
          "proposed_changes.branch_address.area": data?.branch_address?.area,
          "proposed_changes.branch_address.district":
            data?.branch_address?.district,
          "proposed_changes.branch_address.taluka":
            data?.branch_address?.taluka,
          "proposed_changes.branch_address.state": data?.branch_address?.state,
          "proposed_changes.branch_address.city": data?.branch_address?.city,
          "proposed_changes.branch_address.country":
            data?.branch_address?.country,
          "proposed_changes.branch_address.pincode":
            data?.branch_address?.pincode,
          "proposed_changes.isActive": data?.isActive,
          "proposed_changes.status": false,
          approver: approvalData(req.user),
        },
      },
      { new: true }
    );

    if (!updateBranch)
      return next(new ApiError("please check the branchId or CompanyId", 400));

    adminApprovalFunction({
      module: this.#collectionName,
      user: req.user,
      documentId: branchId
    })

    return res.status(200).json({
      statusCode: 200,
      status: "Updated",
      data: {
        branch: updateBranch,
      },
      message: `${this.#modalName} Branch updated`,
    });
  });
  uploadDocument = (fileName) => {
    return catchAsync(async (req, res, next) => {
      const { branchId, companyId } = req.params;
      // const branch = await this.#modal.findOne({ _id: branchId, [`${this.#modalName}Id`]: companyId });
      const images = {};
      if (req.files) {
        for (let i in req.files) {
          images[i] = req.files[i][0].filename;
          // need to change i needed proposed_changes
          // if (fs.existsSync(`${fileName}/${i.split("_")[0] === "passbook" ? branch?.kyc?.bank_details[i] : branch?.kyc[i?.split("_")[0]][i]}`)) {
          //     fs.unlinkSync(`${fileName}/${i.split("_")[0] === "passbook" ? branch?.kyc?.bank_details[i] : branch?.kyc[i?.split("_")[0]][i]}`)
          // }
        }
      }
      const updatedImages = await this.#modal.updateOne(
        { _id: branchId, [`proposed_changes.${this.#modalName}Id`]: companyId },
        {
          $set: {
            "proposed_changes.kyc.pan.pan_image": images?.pan_image,
            "proposed_changes.kyc.gst.gst_image": images?.gst_image,
            "proposed_changes.status": false,
            "proposed_changes.kyc.bank_details.passbook_image":
              images?.passbook_image,
            approver: approvalData(req.user),
          },
        }
      );

      adminApprovalFunction({
        module: this.#collectionName,
        user: req.user,
        documentId: branchId
      })

      return res.status(200).json({
        statusCode: 200,
        status: "Updated",
        data: {
          KYC_Images: updatedImages,
        },
        message: "File has been uploaded",
      });
    });
  };
  AddContact = catchAsync(async (req, res, next) => {
    const { companyId, branchId } = req.params;
    if (!companyId || !branchId) {
      return next(new ApiError("companyId or BranchId is required", 400));
    }
    const addConatct = await this.#modal.findByIdAndUpdate(
      { _id: branchId, [`proposed_changes.${this.#modalName}Id`]: companyId },
      {
        $push: {
          "proposed_changes.contact_person": req.body,
        },
        $set: {
          "proposed_changes.status": false,
          approver: approvalData(req.user)
        }
      },
      { runValidators: true, new: true }
    );
    if (!addConatct) {
      return next(new ApiError("companyId or BranchId is not exits", 400))
    }

    adminApprovalFunction({
      module: this.#collectionName,
      user: req.user,
      documentId: branchId
    })

    return res.status(201).json({
      statusCode: 201,
      status: "Created",
      data: {
        branch: addConatct,
      },
      message: "Branch contact created",
    });
  });
  UpdateContact = catchAsync(async (req, res, next) => {
    const { companyId, branchId } = req.params;
    const {
      first_name,
      last_name,
      role,
      primary_email,
      secondary_email,
      primary_mobile,
      secondary_mobile,
      isActive
    } = req.body;
    if (!req.query.contactId) {
      return next(new ApiError("contactId is required", 400));
    }
    const updatedContact = await this.#modal.findOneAndUpdate(
      {
        _id: branchId,
        [`proposed_changes.${this.#modalName}Id`]: companyId,
        "proposed_changes.contact_person._id": req.query.contactId,
      },
      {
        $set: {
          "proposed_changes.contact_person.$[e].first_name": first_name,
          "proposed_changes.contact_person.$[e].last_name": last_name,
          "proposed_changes.contact_person.$[e].role": role,
          "proposed_changes.contact_person.$[e].primary_email": primary_email,
          "proposed_changes.contact_person.$[e].secondary_email":
            secondary_email,
          "proposed_changes.contact_person.$[e].primary_mobile": primary_mobile,
          "proposed_changes.contact_person.$[e].secondary_mobile":
            secondary_mobile,
          "proposed_changes.contact_person.$[e].isActive": isActive,
          "proposed_changes.status": false,
          approver: approvalData(req.user)
        },
      },
      {
        arrayFilters: [{ "e._id": req.query.contactId }],
        runValidators: true,
        new: true,
      }
    );

    adminApprovalFunction({
      module: this.#collectionName,
      user: req.user,
      documentId: branchId
    })

    return res.status(200).json({
      statusCode: 200,
      status: "Updated",
      data: {
        branch: updatedContact,
      },
      message: "Branch contact updated",
    });
  });
  setPrimaryContact = catchAsync(async (req, res, next) => {
    const { companyId, branchId } = req.params;
    const { contactId } = req.query
    const user = req.user;
    const contactPrimary = await this.#modal.updateOne({
      _id: branchId,
      [`current_data.${this.#modalName}Id`]: companyId,
      "current_data.contact_person._id": contactId
    }, {
      $set: {
        "proposed_changes.contact_person.$[ele].isPrimary": false,
        "proposed_changes.contact_person.$[e].isPrimary": true,
        "proposed_change.status": false,
        approver: approvalData(user)
      }
    }, {
      arrayFilters: [{ "e._id": contactId }, { "ele._id": { $ne: contactId } }]
    })

    adminApprovalFunction({
      module: this.#collectionName,
      user: user,
      documentId: branchId
    })



    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        contactPrimary
      },
      message: `set to primary`
    })

  })
}
export default Branches;
