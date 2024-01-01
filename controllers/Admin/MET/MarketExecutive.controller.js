import catchAsync from "../../../Utils/catchAsync";
import fs from "fs";
import MarketExecutiveModel from "../../../database/schema/MET/MarketExecutive.schema";
import ApiError from "../../../Utils/ApiError";
import mongoose from "mongoose";

export const getMarketExecutive = catchAsync(async (req, res, next) => {
  const { filters = {} } = req.body;
  const { page = 1, limit = 10 } = req.query;

  const marketExec = await MarketExecutiveModel.aggregate([
    {
      $match: filters,
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
  const addME = await MarketExecutiveModel.create(req.body);
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
      $set: data,
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
      if (name === "policy") {
        if (
          fs.existsSync(
            `./uploads/marketExecutive/${MEx.insurance?.policy_image}`
          )
        ) {
          fs.unlinkSync(
            `./uploads/marketExecutive/${MEx.insurance?.policy_image}`
          );
        }
      } else {
        if (name === "passbook") {
          if (
            fs.existsSync(
              `./uploads/marketExecutive/${MEx?.kyc?.bank_details?.passbook_image}`
            )
          ) {
            fs.unlinkSync(
              `./uploads/marketExecutive/${MEx?.kyc?.bank_details?.passbook_image}`
            );
          }
        }
        if (
          fs.existsSync(`./uploads/marketExecutive/${MEx.kyc?.[name]?.[i]}`)
        ) {
          fs.unlinkSync(`./uploads/marketExecutive/${MEx.kyc?.[name]?.[i]}`);
        }
      }
    }
  }
  const updatedImages = await MarketExecutiveModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        "insurance.policy_image": images?.policy_image,
        "kyc.pan.pan_image": images?.pan_image,
        "kyc.gst.gst_image": images?.gst_image,
        "kyc.aadhar.aadhar_image": images?.aadhar_image,
        "kyc.bank_details.passbook_image": images?.passbook_image,
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
        nominee: {
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
    },
    { new: true }
  );
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

  // const editNominee = await MarketExecutiveModel.aggregate([
  //     {
  //         $match:{_id:new mongoose.Types.ObjectId(req.params.id),"nominee._id":new mongoose.Types.ObjectId(req.params.nomineeId)}
  //     },
  //     {
  //         $project:{
  //             nominee:{
  //                 $cond:{if:{$eq:["$nominee._id",new mongoose.Types.ObjectId(req.params.nomineeId)]},then:"kdkdk0",else:"$nominee._id"}
  //             },
  //         }
  //     }
  // ])

  const editNominee = await MarketExecutiveModel.updateOne(
    { _id: req.params.id, "nominee._id": req.params.nomineeId },
    {
      $set: {
        "nominee.$[e].nominee_name": nominee_name,
        "nominee.$[e].nominee_dob": nominee_dob,
        "nominee.$[e].nominee_age": nominee_age,
        "nominee.$[e].address.address": address,
        "nominee.$[e].address.location": location,
        "nominee.$[e].address.area": area,
        "nominee.$[e].address.district": district,
        "nominee.$[e].address.taluka": taluka,
        "nominee.$[e].address.state": state,
        "nominee.$[e].address.city": city,
        "nominee.$[e].address.country": country,
        "nominee.$[e].address.pincode": pincode,
        "nominee.$[e].kyc.pan.pan_no": pan_no,
        "nominee.$[e].kyc.pan.pan_image": images?.pan_image,
        "nominee.$[e].kyc.aadhar.aadhar_no": aadhar_no,
        "nominee.$[e].kyc.aadhar.aadhar_image": images?.aadhar_image,
        "nominee.$[e].bank_details.bank_name": bank_name,
        "nominee.$[e].bank_details.account_no": account_no,
        "nominee.$[e].bank_details.confirm_account_no": confirm_account_no,
        "nominee.$[e].bank_details.ifsc_code": ifsc_code,
        "nominee.$[e].bank_details.passbook_image": images?.passbook_image,
      },
    },
    { arrayFilters: [{ "e._id": req.params.nomineeId }] }
  );

  return res.status(201).json({
    statusCode: 201,
    status: "added",
    data: {
      MarketExecutive: editNominee,
    },
    message: "nominee hass been added",
  });
});
