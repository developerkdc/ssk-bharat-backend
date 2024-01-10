import catchAsync from "../../../Utils/catchAsync";
import fs from "fs";
import crypto from "crypto"
import MarketExecutiveModel from "../../../database/schema/MET/MarketExecutive.schema";
import ApiError from "../../../Utils/ApiError";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import { approvalData } from "../../HelperFunction/approvalFunction";
import adminApprovalFunction from "../../HelperFunction/AdminApprovalFunction";

export const getMarketExecutive = catchAsync(async (req, res, next) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};
  const search = req.query.search || "";
  const { filters = {} } = req.body;
  const { page = 1, limit = 10, sortBy = "company_details.companyName", sort = "desc" } = req.query;

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
  const totalDocuments = await MarketExecutiveModel.countDocuments({
    ...filters,
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocuments / limit);

  const marketExec = await MarketExecutiveModel.aggregate([
    {
      $match: { ...filters, ...searchQuery },
    },
    {
      $sort: {
        [sortBy]: sort == "desc" ? -1 : 1,
      },
    },
    {
      $limit: Number(limit),
    },
    {
      $skip: Number(page) * limit - Number(limit),
    },
  ]);

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: {
      MarketExecutive: marketExec,
      totalPages: totalPages,
    },
  });
});

export const getMarketExecutiveById = catchAsync(async (req, res, next) => {
  const marketExec = await MarketExecutiveModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
    },
  ]);

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: {
      MarketExecutive: marketExec,
    },
  });
});

export const addMarketExec = catchAsync(async (req, res, next) => {
  const { approver, ...data } = req.body;

  let Password = crypto.randomBytes(8).toString("hex");
  let protectedPassword = bcrypt.hashSync(Password, 12);
  data.contact_person_details.password = protectedPassword

  const addME = await MarketExecutiveModel.create({
    current_data: { ...data },
    approver: approvalData(req.user)
  });

  adminApprovalFunction({
    module: MarketExecutiveModel,
    user: req.user,
    documentId: addME._id
  })

  return res.status(201).json({
    statusCode: 201,
    status: "created",
    data: {
      MarketExecutive: addME,
    },
  });
});

export const updateMarketExec = catchAsync(async (req, res) => {
  const { nominee, ...data } = req.body;
  const updateME = await MarketExecutiveModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        "proposed_changes.company_details": data?.company_details,
        "proposed_changes.contact_person_details.first_name": data?.contact_person_details?.first_name,
        "proposed_changes.contact_person_details.last_name": data?.contact_person_details?.last_name,
        "proposed_changes.contact_person_details.blood_group": data?.contact_person_details?.blood_group,
        "proposed_changes.contact_person_details.primary_email_id": data?.contact_person_details?.primary_email_id,
        "proposed_changes.contact_person_details.secondary_email_id": data?.contact_person_details?.secondary_email_id,
        "proposed_changes.contact_person_details.primary_mobile_no": data?.contact_person_details?.primary_mobile_no,
        "proposed_changes.contact_person_details.secondary_mobile_no": data?.contact_person_details?.secondary_mobile_no,
        "proposed_changes.contact_person_details.onboarding_date": data?.contact_person_details?.onboarding_date,
        "proposed_changes.contact_person_details.role_assign": data?.contact_person_details?.role_assign,
        "proposed_changes.kyc.kyc_status": data?.kyc?.kyc_status,
        "proposed_changes.kyc.pan.pan_no": data?.kyc?.pan?.pan_no,
        "proposed_changes.kyc.aadhar.aadhar_no": data?.kyc?.aadhar?.aadhar_no,
        "proposed_changes.kyc.gst.gst_no": data?.kyc?.gst?.gst_no,
        "proposed_changes.kyc.bank_details.bank_name": data?.kyc?.bank_details?.bank_name,
        "proposed_changes.kyc.bank_details.account_no": data?.kyc?.bank_details?.account_no,
        "proposed_changes.kyc.bank_details.confirm_account_no": data?.kyc?.bank_details?.confirm_account_no,
        "proposed_changes.kyc.bank_details.ifsc_code": data?.kyc?.bank_details?.ifsc_code,
        "proposed_changes.insurance.policy_no": data?.insurance?.policy_no,
        "proposed_changes.insurance.policy_company_name": data?.insurance?.policy_company_name,
        "proposed_changes.insurance.policy_date": data?.insurance?.policy_date,
        "proposed_changes.insurance.policy_amount": data?.insurance?.policy_amount,
        "proposed_changes.insurance.renewal_date": data?.insurance?.renewal_date,
        "proposed_changes.address.address": data?.address?.address,
        "proposed_changes.address.location": data?.address?.location,
        "proposed_changes.address.area": data?.address?.area,
        "proposed_changes.address.district": data?.address?.district,
        "proposed_changes.address.taluka": data?.address?.taluka,
        "proposed_changes.address.state": data?.address?.state,
        "proposed_changes.address.city": data?.address?.city,
        "proposed_changes.address.country": data?.address?.country,
        "proposed_changes.address.pincode": data?.address?.pincode,
        "proposed_changes.isActive": data?.isActive,
        "proposed_changes.status": false,
        approver: approvalData(req.user),
        updated_at: Date.now()
      },
    },
    { runValidators: true }
  );

  if (!updateME.acknowledged) {
    return res.status(400).json({
      statusCode: 400,
      status: "update Failed",
      message: "Market Executive Member has not updated",
    });
  }

  adminApprovalFunction({
    module: MarketExecutiveModel,
    user: req.user,
    documentId: req.params.id
  })

  return res.status(201).json({
    statusCode: 201,
    status: "updated",
    data: {
      MarketExecutive: updateME,
    },
    message: "Market Executive Member has been updated",
  });
});

export const uploadMarketExecImages = catchAsync(async (req, res, next) => {
  const MEx = await MarketExecutiveModel.findOne({ _id: req.params.id });
  if (!MEx) return next(new ApiError("Market Executive is not exits"));
  const images = {};
  if (req.files) {
    for (let i in req.files) {
      const name = i.split("_")[0];
      images[i] = req.files[i][0].filename;
      // if (name === "policy") {
      //   if (
      //     fs.existsSync(
      //       `./uploads/marketExecutive/${MEx.insurance?.policy_image}`
      //     )
      //   ) {
      //     fs.unlinkSync(
      //       `./uploads/marketExecutive/${MEx.insurance?.policy_image}`
      //     );
      //   }
      // } else {
      //   if (name === "passbook") {
      //     if (
      //       fs.existsSync(
      //         `./uploads/marketExecutive/${MEx?.kyc?.bank_details?.passbook_image}`
      //       )
      //     ) {
      //       fs.unlinkSync(
      //         `./uploads/marketExecutive/${MEx?.kyc?.bank_details?.passbook_image}`
      //       );
      //     }
      //   }
      //   if (
      //     fs.existsSync(`./uploads/marketExecutive/${MEx.kyc?.[name]?.[i]}`)
      //   ) {
      //     fs.unlinkSync(`./uploads/marketExecutive/${MEx.kyc?.[name]?.[i]}`);
      //   }
      // }
    }
  }
  const updatedImages = await MarketExecutiveModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        "proposed_changes.insurance.policy_image": images?.policy_image,
        "proposed_changes.kyc.pan.pan_image": images?.pan_image,
        "proposed_changes.kyc.gst.gst_image": images?.gst_image,
        "proposed_changes.kyc.aadhar.aadhar_image": images?.aadhar_image,
        "proposed_changes.kyc.bank_details.passbook_image": images?.passbook_image,
        "proposed_changes.status": false,
        approver: approvalData(req.user),
        updated_at: Date.now()
      },
    }
  );

  if (!updatedImages.acknowledged) {
    return res.status(400).json({
      statusCode: 400,
      status: "not updated",
      message: "files has not uploaded",
    });
  }
  adminApprovalFunction({
    module: MarketExecutiveModel,
    user: req.user,
    documentId: req.params.id
  })

  return res.status(201).json({
    statusCode: 201,
    status: "uploaded",
    data: {
      MarketExecutive: updatedImages,
    },
    message: "files has been uploaded",
  });
});

export const addNominee = catchAsync(async (req, res, next) => {
  const {
    nominee_name,
    nominee_dob,
    nominee_age,
    address,
    location,
    area,
    district,
    taluka,
    state,
    city,
    country,
    pincode,
    pan_no,
    aadhar_no,
    bank_name,
    account_no,
    confirm_account_no,
    ifsc_code,
  } = req.body;
  const { pan_image, aadhar_image, passbook_image } = req.files;
  const addNominee = await MarketExecutiveModel.updateOne(
    { _id: req.params.id },
    {
      $push: {
        "proposed_changes.nominee": {
          nominee_name,
          nominee_dob,
          nominee_age,
          address: {
            address,
            location,
            area,
            district,
            taluka,
            state,
            city,
            country,
            pincode,
          },
          kyc: {
            kyc_status: false,
            pan: {
              pan_no,
              pan_image: pan_image[0].filename,
            },
            aadhar: {
              aadhar_no,
              aadhar_image: aadhar_image[0].filename,
            },
            bank_details: {
              bank_name,
              account_no,
              confirm_account_no,
              ifsc_code,
              passbook_image: passbook_image[0].filename,
            },
          },
        },
      },
      $set: {
        "proposed_changes.status": false,
        approver: approvalData(req.user),
        updated_at: Date.now()
      },
    },
    { new: true }
  );


  adminApprovalFunction({
    module: MarketExecutiveModel,
    user: req.user,
    documentId: req.params.id
  })

  return res.status(201).json({
    statusCode: 201,
    status: "added",
    data: {
      MarketExecutive: addNominee,
    },
    message: "nominee hass been added",
  });
});

export const editNominee = catchAsync(async (req, res, next) => {
  const {
    nominee_name,
    nominee_dob,
    nominee_age,
    address,
    isActive,
    location,
    area,
    district,
    taluka,
    state,
    city,
    country,
    pincode,
    pan_no,
    aadhar_no,
    bank_name,
    account_no,
    confirm_account_no,
    ifsc_code,
  } = req.body;
  const { pan_image, aadhar_image, passbook_image } = req.files;

  const images = {};
  if (req.files) {
    for (let i in req.files) {
      images[i] = req.files[i][0].filename;
    }
  }

  const editNominee = await MarketExecutiveModel.updateOne(
    { _id: req.params.id, "proposed_changes.nominee._id": req.params.nomineeId },
    {
      $set: {
        "proposed_changes.nominee.$[e].nominee_name": nominee_name,
        "proposed_changes.nominee.$[e].nominee_dob": nominee_dob,
        "proposed_changes.nominee.$[e].nominee_age": nominee_age,
        "proposed_changes.nominee.$[e].address.address": address,
        "proposed_changes.nominee.$[e].address.location": location,
        "proposed_changes.nominee.$[e].address.area": area,
        "proposed_changes.nominee.$[e].address.district": district,
        "proposed_changes.nominee.$[e].address.taluka": taluka,
        "proposed_changes.nominee.$[e].address.state": state,
        "proposed_changes.nominee.$[e].address.city": city,
        "proposed_changes.nominee.$[e].address.country": country,
        "proposed_changes.nominee.$[e].address.pincode": pincode,
        "proposed_changes.nominee.$[e].kyc.pan.pan_no": pan_no,
        "proposed_changes.nominee.$[e].kyc.pan.pan_image": images?.pan_image,
        "proposed_changes.nominee.$[e].kyc.aadhar.aadhar_no": aadhar_no,
        "proposed_changes.nominee.$[e].kyc.aadhar.aadhar_image": images?.aadhar_image,
        "proposed_changes.nominee.$[e].kyc.bank_details.bank_name": bank_name,
        "proposed_changes.nominee.$[e].kyc.bank_details.account_no": account_no,
        "proposed_changes.nominee.$[e].kyc.bank_details.confirm_account_no": confirm_account_no,
        "proposed_changes.nominee.$[e].kyc.bank_details.ifsc_code": ifsc_code,
        "proposed_changes.nominee.$[e].kyc.bank_details.passbook_image": images?.passbook_image,
        "proposed_changes.nominee.$[e].isActive": isActive,
        "proposed_changes.status": false,
        approver: approvalData(req.user),
        updated_at: Date.now()
      },
    },
    { arrayFilters: [{ "e._id": req.params.nomineeId }] }
  );

  adminApprovalFunction({
    module: MarketExecutiveModel,
    user: req.user,
    documentId:req.params.id
  })

  return res.status(201).json({
    statusCode: 201,
    status: "added",
    data: {
      MarketExecutive: editNominee,
    },
    message: "nominee hass been added",
  });
});
