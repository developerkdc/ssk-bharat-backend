import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
const offlineStore = mongoose.model("offlinestores")
const offlinestorebranches = mongoose.model("offlinestorebranches")

export const getMyBranch = catchAsync(async (req, res, next) => {
    const { string, boolean, numbers } = req?.body?.searchFields || {};
    const search = req.query.search || "";
    const { filters = {} } = req.body;
    const {
        sortBy = "created_at",
        sort = "desc",
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 10

    const offlineUser = req.offlineUser;

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

    const matchQuery = {
        "current_data.offlinestoreId": offlineUser?._id,
        ...filters,
        "current_data.status": true
    }

    //total pages
    const totalDocuments = await offlinestorebranches.countDocuments({
        ...matchQuery,
        ...searchQuery,
    });
    const totalPages = Math.ceil(totalDocuments / limit);

    const data = await offlinestorebranches
        .aggregate([
            {
                $match: { ...matchQuery },
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
                    from: "offlinestores",
                    localField: `current_data.offlinestoreId`,
                    foreignField: "_id",
                    as: `current_data.offlinestoreId`,
                },
            },
            {
                $unwind: {
                    path: `$current_data.offlinestoreId`,
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: { ...searchQuery }
            },
        ])
    return res.status(200).json({
        statusCode: 200,
        status: "Success",
        totalPages: totalPages,
        data: {
            branch: data,
        },
        message: `offlineStore All Branch`,
    });
});
export const getMySingleBranch = catchAsync(async (req, res, next) => {
    const branch = await offlinestorebranches
        .find({ [`offlinestoreId`]: req.params.companyId })
        .populate({
            path: `offlinestoreId`,
            select: "current_data.company_name current_data.company_type"
        });
    return res.status(200).json({
        statusCode: 200,
        status: "Success",
        data: {
            branch: branch,
        },
        message: `offlineStore All Branch`,
    });
});
export const GetBranchList = catchAsync(async (req, res, next) => {
    const offlineUser = req.offlineUser;
    const modalName = await offlinestorebranches.find(
        { "current_data.offlinestoreId": offlineUser?._id, "current_data.isActive": true, "current_data.status": true },
        { "current_data": 1, });

    return res.status(201).json({
        statusCode: 200,
        status: "Success",
        data: {
            offlinestorebranches: modalName,
        },
    });
})
export const addBranch = catchAsync(async (req, res, next) => {
    const offlineUser = req.offlineUser;
    const { approver, kyc: { pan, gst, bank_details }, ...data } = JSON.parse(req.body?.branchData);
    const images = {};
    if (req.files) {
        for (let i in req.files) {
            images[i] = req.files[i][0].path;
        }
    }
    const branch = await offlinestorebranches.create({
        current_data: {
            ...data,
            offlinestoreId: offlineUser?._id,
            kyc: {
                // pan: {
                //   pan_no: pan?.pan_no,
                //   pan_image: images["pan_image"]
                // },
                gst: {
                    gst_no: gst?.gst_no,
                    gst_image: images["gst_image"]
                },
                bank_details: {
                    bank_name: bank_details?.bank_name,
                    account_no: bank_details?.account_no,
                    confirm_account_no: bank_details?.confirm_account_no,
                    ifsc_code: bank_details?.ifsc_code,
                    passbook_image: images["passbook_image"]
                }
            },
            status:true
        },
        // approver: approvalData(user),
    });

    return res.status(201).json({
        statusCode: 201,
        status: "Created",
        data: {
            branch: branch,
        },
        message: `offlineStore Branch created`,
    });
});
export const updateBranch = catchAsync(async (req, res, next) => {
    const { branchId } = req.query;
    const offlineUser = req.offlineUser;
    const { contact_person, approver, ...data } = req.body;
    if (!branchId) {
        return next(new ApiError("branch id is required"));
    }
    const updateBranch = await offlinestorebranches.findOneAndUpdate(
        {
            _id: branchId,
            [`proposed_changes.offlinestoreId`]: offlineUser?._id,
        },
        {
            $set: {
                "current_data.branch_name": data?.branch_name,
                "current_data.branch_onboarding_date": data?.branch_onboarding_date,
                // "current_data.kyc.pan.pan_no": data?.kyc?.pan?.pan_no,
                "current_data.kyc.gst.gst_no": data?.kyc?.gst?.gst_no,
                "current_data.kyc.kyc_status": data?.kyc?.kyc_status,
                "current_data.kyc.bank_details.bank_name":
                    data?.kyc?.bank_details?.bank_name,
                "current_data.kyc.bank_details.account_no":
                    data?.kyc?.bank_details?.account_no,
                "current_data.kyc.bank_details.confirm_account_no":
                    data?.kyc?.bank_details?.confirm_account_no,
                "current_data.kyc.bank_details.ifsc_code":
                    data?.kyc?.bank_details?.ifsc_code,
                "current_data.branch_address.address":
                    data?.branch_address?.address,
                "current_data.branch_address.location":
                    data?.branch_address?.location,
                "current_data.branch_address.area": data?.branch_address?.area,
                "current_data.branch_address.district":
                    data?.branch_address?.district,
                "current_data.branch_address.taluka":
                    data?.branch_address?.taluka,
                "current_data.branch_address.state": data?.branch_address?.state,
                "current_data.branch_address.city": data?.branch_address?.city,
                "current_data.branch_address.country":
                    data?.branch_address?.country,
                "current_data.branch_address.pincode":
                    data?.branch_address?.pincode,
                "current_data.isActive": data?.isActive,
                "current_data.status": true,
                "proposed_changes.branch_name": data?.branch_name,
                "proposed_changes.branch_onboarding_date": data?.branch_onboarding_date,
                // "proposed_changes.kyc.pan.pan_no": data?.kyc?.pan?.pan_no,
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
                "proposed_changes.status": true,
                // approver: approvalData(req.user),
            },
        },
        { new: true }
    );

    if (!updateBranch)
        return next(new ApiError("please check the branchId or CompanyId", 400));

    return res.status(200).json({
        statusCode: 200,
        status: "Updated",
        data: {
            branch: updateBranch,
        },
        message: `offlineStore Branch updated`,
    });
});
export const uploadDocument = catchAsync(async (req, res, next) => {
    const { branchId } = req.params;
    const offlineUser = req.offlineUser;
    // const branch = await offlinestorebranches.findOne({ _id: branchId, [`offlinestoreId`]: companyId });
    const images = {};
    if (req.files) {
        for (let i in req.files) {
            images[i] = req.files[i][0].path;
            // need to change i needed proposed_changes
            // if (fs.existsSync(`${fileName}/${i.split("_")[0] === "passbook" ? branch?.kyc?.bank_details[i] : branch?.kyc[i?.split("_")[0]][i]}`)) {
            //     fs.unlinkSync(`${fileName}/${i.split("_")[0] === "passbook" ? branch?.kyc?.bank_details[i] : branch?.kyc[i?.split("_")[0]][i]}`)
            // }
        }
    }
    const updatedImages = await offlinestorebranches.updateOne(
        { _id: branchId, [`proposed_changes.offlinestoreId`]: offlineUser?._id },
        {
            $set: {
                // "proposed_changes.kyc.pan.pan_image": images?.pan_image,
                "current_data.kyc.gst.gst_image": images?.gst_image,
                "current_data.kyc.bank_details.passbook_image": images?.passbook_image,
                "current_data.status": true,
                "proposed_changes.kyc.gst.gst_image": images?.gst_image,
                "proposed_changes.kyc.bank_details.passbook_image": images?.passbook_image,
                "proposed_changes.status": true,
                // approver: approvalData(req.user),
            },
        }
    );


    return res.status(200).json({
        statusCode: 200,
        status: "Updated",
        data: {
            KYC_Images: updatedImages,
        },
        message: "File has been uploaded",
    });
});
export const AddContact = catchAsync(async (req, res, next) => {
    const { branchId } = req.params;
    const offlineUser = req.offlineUser;
    if (!branchId) {
        return next(new ApiError("BranchId is required", 400));
    }

    const max5Contact = await offlinestorebranches.findOne({ _id: branchId, "proposed_changes.offlinestoreId": offlineUser?._id });

    if (!max5Contact) {
        return next(new ApiError("can't find branch", 400));
    }

    if (max5Contact?.current_data?.contact_person.length >= 5) {
        return next(new ApiError("you cannot add contact person more than 5", 400));
    }

    const addConatct = await offlinestorebranches.findOneAndUpdate(
        { _id: branchId, "proposed_changes.offlinestoreId": offlineUser?._id },
        {
            $push: {
                "current_data.contact_person": req.body,
                "proposed_changes.contact_person": req.body,
            },
            $set: {
                "current_data.status": true,
                "proposed_changes.status": true,
                // approver: approvalData(req.user)
            }
        },
        { runValidators: true, new: true }
    );
    if (!addConatct) {
        return next(new ApiError("companyId or BranchId is not exits", 400))
    }

    return res.status(201).json({
        statusCode: 201,
        status: "Created",
        data: {
            branch: addConatct,
        },
        message: "Branch contact created",
    });
});
export const UpdateContact = catchAsync(async (req, res, next) => {
    const { branchId } = req.params;
    const offlineUser = req.offlineUser;
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
    const updatedContact = await offlinestorebranches.findOneAndUpdate(
        {
            _id: branchId,
            "proposed_changes.offlinestoreId": offlineUser?._id,
            "proposed_changes.contact_person._id": req.query.contactId,
        },
        {
            $set: {
                "current_data.contact_person.$[e].first_name": first_name,
                "current_data.contact_person.$[e].last_name": last_name,
                "current_data.contact_person.$[e].role": role,
                "current_data.contact_person.$[e].primary_email": primary_email,
                "current_data.contact_person.$[e].secondary_email":
                    secondary_email,
                "current_data.contact_person.$[e].primary_mobile": primary_mobile,
                "current_data.contact_person.$[e].secondary_mobile":
                    secondary_mobile,
                "current_data.contact_person.$[e].isActive": isActive,
                "current_data.status": true,
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
                "proposed_changes.status": true,
                // approver: approvalData(req.user)
            },
        },
        {
            arrayFilters: [{ "e._id": req.query.contactId }],
            runValidators: true,
            new: true,
        }
    );

    return res.status(200).json({
        statusCode: 200,
        status: "Updated",
        data: {
            branch: updatedContact,
        },
        message: "Branch contact updated",
    });
});
export const setPrimaryContact = catchAsync(async (req, res, next) => {
    const offlineUser = req.offlineUser;
    const { branchId } = req.params;
    const { contactId } = req.query
    const contactPrimary = await offlinestorebranches.updateOne({
        _id: branchId,
        "current_data.offlinestoreId": offlineUser?._id,
        "current_data.contact_person._id": contactId
    }, {
        $set: {
            "current_data.contact_person.$[ele].isPrimary": false,
            "current_data.contact_person.$[e].isPrimary": true,
            "current_data.status": true,
            "proposed_changes.contact_person.$[ele].isPrimary": false,
            "proposed_changes.contact_person.$[e].isPrimary": true,
            "proposed_change.status": true,
            // approver: approvalData(user)
        }
    }, {
        arrayFilters: [{ "e._id": contactId }, { "ele._id": { $ne: contactId } }]
    })

    return res.status(200).json({
        statusCode: 200,
        status: "success",
        data: {
            contactPrimary
        },
        message: `set to primary`
    })

});
export const deleteContactPerson = catchAsync(async (req, res, next) => {
    const { companyId, branchId } = req.params;
    if (!companyId || !branchId) {
        return next(new ApiError("companyId or BranchId is required", 400));
    }

    const max5Contact = await offlinestorebranches.findOne({ _id: branchId, [`proposed_changes.offlinestoreId`]: companyId });

    if (!max5Contact) {
        return next(new ApiError("can't find branch", 400));
    }



    return res.status(201).json({
        statusCode: 201,
        status: "deleted",
        message: "contact deleted"
    })
})