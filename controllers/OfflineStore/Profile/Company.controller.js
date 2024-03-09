import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
const offlineStore = mongoose.model("offlinestores")
const offlinestorebranches = mongoose.model("offlinestorebranches")


// export const GetOfflinestore = catchAsync(async (req, res, next) => {
//     const { string, boolean, numbers } = req?.body?.searchFields || {};
//     const search = req.query.search || "";
//     const { filters = {} } = req.body;
//     const {
//         page = 1,
//         limit = 10,
//         sortBy = "company_name",
//         sort = "desc",
//     } = req.query;
//     const skip = (page - 1) * limit;

//     let searchQuery = {};
//     if (search != "" && req?.body?.searchFields) {
//         const searchdata = dynamicSearch(search, boolean, numbers, string);
//         if (searchdata?.length == 0) {
//             return res.status(404).json({
//                 statusCode: 404,
//                 status: "failed",
//                 data: {
//                     data: [],
//                 },
//                 message: "Results Not Found",
//             });
//         }
//         searchQuery = searchdata;
//     }

//     //total pages
//     const totalDocuments = await offlineStore.countDocuments({
//         ...filters,
//         ...searchQuery,
//         "current_data.status": true,
//     });
//     const totalPages = Math.ceil(totalDocuments / limit);

//     const modalName = await offlineStore
//         .find({ ...filters, ...searchQuery, "current_data.status": true })
//         .skip(skip)
//         .limit(limit)
//         .sort({ [sortBy]: sort });

//     return res.status(201).json({
//         statusCode: 200,
//         status: "Success",
//         totalPages: totalPages,
//         length: modalName.length,
//         data: {
//             company: modalName,
//         },
//         message: `All company`,
//     });
// });
export const GetOfflinestore = catchAsync(async (req, res, next) => {
    const offlineUser = req.offlineUser;
    const modalName = await offlineStore
        .findOne({ _id: offlineUser?._id })
        .populate({
            path: "current_data.primaryBranch",
            select: "_id current_data",
        });
    return res.status(200).json({
        statusCode: 200,
        status: "Success",
        data: {
            company: modalName,
        },
    });
});
// export const GetOfflinestoreList = catchAsync(async (req, res, next) => {
//     const modalName = await offlineStore.find(
//         { "current_data.isActive": true, "current_data.status": true },
//         {
//             company_name: "$current_data.company_name",
//             pan_no: "$current_data.pan.pan_no",
//         }
//     );
//     return res.status(201).json({
//         statusCode: 200,
//         status: "Success",
//         data: {
//             company: modalName,
//         },
//     });
// });
export const UpdateOfflinestore = catchAsync(async (req, res, next) => {
    const { username, company_name, onboarding_date, isActive, pan_no } = req.body;
    const { id } = req.params;
    const offlineUser = req.offlineUser;
    let pan_image;
    if (req.file) {
        pan_image = req.file.path;
    }
    const updateData = await offlineStore.findByIdAndUpdate(
        { _id: offlineUser?._id },
        {
            $set: {
                "current_data.username": username,
                "current_data.company_name": company_name,
                "current_data.status": true,
                "current_data.isActive": isActive,
                "current_data.onboarding_date": onboarding_date,
                "current_data.pan.pan_no": pan_no,
                "current_data.pan.pan_image": pan_image,
                "proposed_changes.username": username,
                "proposed_changes.company_name": company_name,
                "proposed_changes.status": true,
                "proposed_changes.isActive": isActive,
                "proposed_changes.onboarding_date": onboarding_date,
                "proposed_changes.pan.pan_no": pan_no,
                "proposed_changes.pan.pan_image": pan_image,
                updated_at: Date.now(),
            },
        },
        { new: true }
    );

    return res.status(200).json({
        statusCode: 200,
        status: "Updated",
        data: {
            company: updateData,
        },
        message: `company has Updated`,
    });
});
export const setPrimaryBranch = catchAsync(async (req, res, next) => {
    const { companyId, branchId } = req.params;
    const offlineUser = req.offlineUser;
    if (!mongoose.Types.ObjectId.isValid(branchId))
        return next(new ApiError(`${branchId} this is not valid Id`, 400));

    const user = req.user;
    if (!user) return next(new ApiError("please Login and try again", 404));

    const branchData = await offlinestorebranches
        .findOne({
            _id: branchId,
            [`current_data.retailerId`]: offlineUser?._id,
            "proposed_changes.isActive": true,
            "proposed_changes.status": true,
        });
    if (!branchData) return next(new ApiError(`Branch is not exits`, 404));

    const setPrimary = await offlineStore.updateOne(
        { _id: offlineUser?._id },
        {
            $set: {
                "current_data.primaryBranch": branchId,
                "proposed_changes.primaryBranch": branchId,
                updated_at: Date.now(),
            },
        }
    );

    if (!setPrimary.acknowledged && setPrimary.modifiedCount === 0) {
        return next(new ApiError("Unable to set primary branch", 400));
    }

    return res.status(201).json({
        statusCode: 201,
        status: "success",
        data: {
            company: setPrimary,
        },
        message: "Branch set as primary",
    });
});