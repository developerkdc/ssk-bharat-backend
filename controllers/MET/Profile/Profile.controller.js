import catchAsync from "../../../Utils/catchAsync";
import MarketExecutiveModel from "../../../database/schema/MET/MarketExecutive.schema";
import ApiError from "../../../Utils/ApiError";

export const getSingleMarketExecutive = catchAsync(async (req, res, next) => {
    const metUser = req.metUser
    const marketExec = await MarketExecutiveModel.findOne({ _id: metUser?._id });

    return res.status(200).json({
        statusCode: 200,
        status: "success",
        data: {
            MarketExecutive: marketExec,
        },
    });
});

export const updateMarketExec = catchAsync(async (req, res) => {
    const { nominee, ...data } = req.body;
    const metUser = req.metUser
    const updateME = await MarketExecutiveModel.updateOne(
        { _id: metUser?._id },
        {
            $set: {
                "current_data.company_details": data?.company_details,
                "current_data.contact_person_details.first_name": data?.contact_person_details?.first_name,
                "current_data.contact_person_details.last_name": data?.contact_person_details?.last_name,
                "current_data.contact_person_details.blood_group": data?.contact_person_details?.blood_group,
                "current_data.contact_person_details.primary_email_id": data?.contact_person_details?.primary_email_id,
                "current_data.contact_person_details.secondary_email_id": data?.contact_person_details?.secondary_email_id,
                "current_data.contact_person_details.primary_mobile_no": data?.contact_person_details?.primary_mobile_no,
                "current_data.contact_person_details.secondary_mobile_no": data?.contact_person_details?.secondary_mobile_no,
                "current_data.contact_person_details.onboarding_date": data?.contact_person_details?.onboarding_date,
                "current_data.contact_person_details.role_assign": data?.contact_person_details?.role_assign,
                "current_data.kyc.kyc_status": data?.kyc?.kyc_status,
                "current_data.kyc.pan.pan_no": data?.kyc?.pan?.pan_no,
                "current_data.kyc.aadhar.aadhar_no": data?.kyc?.aadhar?.aadhar_no,
                "current_data.kyc.gst.gst_no": data?.kyc?.gst?.gst_no,
                "current_data.kyc.bank_details.bank_name": data?.kyc?.bank_details?.bank_name,
                "current_data.kyc.bank_details.account_no": data?.kyc?.bank_details?.account_no,
                "current_data.kyc.bank_details.confirm_account_no": data?.kyc?.bank_details?.confirm_account_no,
                "current_data.kyc.bank_details.ifsc_code": data?.kyc?.bank_details?.ifsc_code,
                "current_data.insurance.policy_no": data?.insurance?.policy_no,
                "current_data.insurance.policy_company_name": data?.insurance?.policy_company_name,
                "current_data.insurance.policy_date": data?.insurance?.policy_date,
                "current_data.insurance.policy_amount": data?.insurance?.policy_amount,
                "current_data.insurance.renewal_date": data?.insurance?.renewal_date,
                "current_data.address.address": data?.address?.address,
                "current_data.address.location": data?.address?.location,
                "current_data.address.area": data?.address?.area,
                "current_data.address.district": data?.address?.district,
                "current_data.address.taluka": data?.address?.taluka,
                "current_data.address.state": data?.address?.state,
                "current_data.address.city": data?.address?.city,
                "current_data.address.country": data?.address?.country,
                "current_data.address.pincode": data?.address?.pincode,
                "current_data.isActive": data?.isActive,
                "current_data.status": true,
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
                "proposed_changes.status": true,
                // approver: approvalData(req.user),
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

    // adminApprovalFunction({
    //     module: "MarketExecutive",
    //     user: req.user,
    //     documentId: req.params.id
    // })

    return res.status(200).json({
        statusCode: 200,
        status: "updated",
        data: {
            MarketExecutive: updateME,
        },
        message: "Market Executive Member has been updated",
    });
});

export const uploadMarketExecImages = catchAsync(async (req, res, next) => {
    const metUser = req.metUser
    const MEx = await MarketExecutiveModel.findOne({ _id: metUser?._id });
    if (!MEx) return next(new ApiError("Market Executive is not exits"));
    const images = {};
    if (req.files) {
        for (let i in req.files) {
            const name = i.split("_")[0];
            images[i] = req.files[i][0].path;
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
        { _id: metUser?._id },
        {
            $set: {
                "current_data.insurance.policy_image": images?.policy_image,
                "current_data.kyc.pan.pan_image": images?.pan_image,
                "current_data.kyc.gst.gst_image": images?.gst_image,
                "current_data.kyc.aadhar.aadhar_image": images?.aadhar_image,
                "current_data.kyc.bank_details.passbook_image": images?.passbook_image,
                "current_data.status": true,
                "proposed_changes.insurance.policy_image": images?.policy_image,
                "proposed_changes.kyc.pan.pan_image": images?.pan_image,
                "proposed_changes.kyc.gst.gst_image": images?.gst_image,
                "proposed_changes.kyc.aadhar.aadhar_image": images?.aadhar_image,
                "proposed_changes.kyc.bank_details.passbook_image": images?.passbook_image,
                "proposed_changes.status": true,
                // approver: approvalData(req.user),
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
    // adminApprovalFunction({
    //     module: "MarketExecutive",
    //     user: req.user,
    //     documentId: req.params.id
    // })

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
    const metUser = req.metUser;
    const nomineeData = JSON.parse(req.body?.nomineeData);
    const { pan_image, aadhar_image, gst_image } = req.files;
    nomineeData.kyc.pan.pan_image = pan_image?.[0]?.path;
    // nomineeData.kyc.gst.gst_image = gst_image?.[0]?.path;
    nomineeData.kyc.aadhar.aadhar_image = aadhar_image?.[0]?.path;


    const addNominee = await MarketExecutiveModel.updateOne(
        { _id: metUser?._id },
        {
            $push: {
                "current_data.nominee": {
                    ...nomineeData
                },
                "proposed_changes.nominee": {
                    ...nomineeData
                },
            },
            $set: {
                "current_data.status": true,
                "proposed_changes.status": true,
                // approver: approvalData(req.user),
                updated_at: Date.now()
            },
        },
        { new: true }
    );


    // adminApprovalFunction({
    //     module: "MarketExecutive",
    //     user: req.user,
    //     documentId: req.params.id
    // })

    return res.status(201).json({
        statusCode: 201,
        status: "added",
        data: {
            MarketExecutive: addNominee,
        },
        message: "nominee has been added",
    });
});

export const editNominee = catchAsync(async (req, res, next) => {
    const nomineeData = JSON.parse(req.body?.nomineeData);
    const isActive = req.body?.isActive
    const metUser = req.metUser;

    const images = {};
    if (req.files) {
        for (let i in req.files) {
            images[i] = req.files[i][0].path;
        }
    }

    const editNominee = await MarketExecutiveModel.updateOne(
        { _id: metUser?._id,"current_data.nominee._id": req.params.nomineeId ,"proposed_changes.nominee._id": req.params.nomineeId },
        {
            $set: {
                "current_data.nominee.$[e].nominee_name": nomineeData?.nominee_name,
                "current_data.nominee.$[e].nominee_dob": nomineeData?.nominee_dob,
                "current_data.nominee.$[e].nominee_age": nomineeData?.nominee_age,
                //address
                "current_data.nominee.$[e].address.address": nomineeData?.address?.address,
                "current_data.nominee.$[e].address.location": nomineeData?.address?.location,
                "current_data.nominee.$[e].address.area": nomineeData?.address?.area,
                "current_data.nominee.$[e].address.district": nomineeData?.address?.district,
                "current_data.nominee.$[e].address.taluka": nomineeData?.address?.taluka,
                "current_data.nominee.$[e].address.state": nomineeData?.address?.state,
                "current_data.nominee.$[e].address.city": nomineeData?.address?.city,
                "current_data.nominee.$[e].address.country": nomineeData?.address?.country,
                "current_data.nominee.$[e].address.pincode": nomineeData?.address?.pincode,
                //kyc
                //pan
                "current_data.nominee.$[e].kyc.pan.pan_no": nomineeData?.kyc?.pan?.pan_no,
                "current_data.nominee.$[e].kyc.pan.pan_image": images?.pan_image,
                //gst
                "current_data.nominee.$[e].kyc.gst.gst_no": nomineeData?.kyc?.gst?.gst_no,
                "current_data.nominee.$[e].kyc.gst.gst_image": images?.gst_image,
                //aadhar
                "current_data.nominee.$[e].kyc.aadhar.aadhar_no": nomineeData?.kyc?.aadhar?.aadhar_no,
                "current_data.nominee.$[e].kyc.aadhar.aadhar_image": images?.aadhar_image,

                "current_data.nominee.$[e].isActive": isActive,
                "current_data.status": true,
                "proposed_changes.nominee.$[e].nominee_name": nomineeData?.nominee_name,
                "proposed_changes.nominee.$[e].nominee_dob": nomineeData?.nominee_dob,
                "proposed_changes.nominee.$[e].nominee_age": nomineeData?.nominee_age,
                //address
                "proposed_changes.nominee.$[e].address.address": nomineeData?.address?.address,
                "proposed_changes.nominee.$[e].address.location": nomineeData?.address?.location,
                "proposed_changes.nominee.$[e].address.area": nomineeData?.address?.area,
                "proposed_changes.nominee.$[e].address.district": nomineeData?.address?.district,
                "proposed_changes.nominee.$[e].address.taluka": nomineeData?.address?.taluka,
                "proposed_changes.nominee.$[e].address.state": nomineeData?.address?.state,
                "proposed_changes.nominee.$[e].address.city": nomineeData?.address?.city,
                "proposed_changes.nominee.$[e].address.country": nomineeData?.address?.country,
                "proposed_changes.nominee.$[e].address.pincode": nomineeData?.address?.pincode,
                //kyc
                //pan
                "proposed_changes.nominee.$[e].kyc.pan.pan_no": nomineeData?.kyc?.pan?.pan_no,
                "proposed_changes.nominee.$[e].kyc.pan.pan_image": images?.pan_image,
                //gst
                "proposed_changes.nominee.$[e].kyc.gst.gst_no": nomineeData?.kyc?.gst?.gst_no,
                "proposed_changes.nominee.$[e].kyc.gst.gst_image": images?.gst_image,
                //aadhar
                "proposed_changes.nominee.$[e].kyc.aadhar.aadhar_no": nomineeData?.kyc?.aadhar?.aadhar_no,
                "proposed_changes.nominee.$[e].kyc.aadhar.aadhar_image": images?.aadhar_image,

                "proposed_changes.nominee.$[e].isActive": isActive,
                "proposed_changes.status": true,
                // approver: approvalData(req.user),
                updated_at: Date.now()
            },
        },
        { arrayFilters: [{ "e._id": req.params.nomineeId }] }
    );

    // adminApprovalFunction({
    //     module: "MarketExecutive",
    //     user: req.user,
    //     documentId: req.params.id
    // })

    return res.status(201).json({
        statusCode: 201,
        status: "updated",
        data: {
            MarketExecutive: editNominee,
        },
        message: "nominee has been updated",
    });
});
