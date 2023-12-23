import catchAsync from "../../../Utils/catchAsync";
import fs from "fs"
import MarketExecutiveModel from "../../../database/schema/MarketExecutive.schema";
import ApiError from "../../../Utils/ApiError";

export const addMarketExec = catchAsync(async (req,res)=>{
    const addME = await MarketExecutiveModel.create(req.body);
    return res.status(201).json({
        statusCode:201,
        status:"created",
        data:{
            MarketExecutive:addME
        }
    })
})

export const updateMarketExec = catchAsync(async (req,res)=>{
    const updateME = await MarketExecutiveModel.updateOne({_id:req.params.id},{
        $set:{...req.body}
    });

    if(!updateME.acknowledged){
        return res.status(400).json({
            statusCode:400,
            status:"update Failed",
            message:"Market Executive Member has not updated"
        })
    }

    return res.status(201).json({
        statusCode:201,
        status:"updated",
        data:{
            MarketExecutive:updateME
        },
        message:"Market Executive Member has been updated"
    })
})

export const uploadMarketExecImages = catchAsync(async (req,res,next)=>{
    const MEx = await MarketExecutiveModel.findOne({_id:req.params.id});
    if(!MEx) return next(new ApiError("Market Executive is not exits"))
    const images = {};
    if(req.files){
        for(let i in req.files){
            const name = i.split("_")[0];
            images[i] = req.files[i][0].filename
            if(name === "policy"){
                if(fs.existsSync(`./uploads/marketExecutive/${MEx.insurance?.policy_image}`)){
                    fs.unlinkSync(`./uploads/marketExecutive/${MEx.insurance?.policy_image}`)
                }
            }else{
                if(name === "passbook"){
                    if(fs.existsSync(`./uploads/marketExecutive/${MEx?.kyc?.bank_details?.passbook_image}`)){
                        fs.unlinkSync(`./uploads/marketExecutive/${MEx?.kyc?.bank_details?.passbook_image}`)
                    }
                }
                if(fs.existsSync(`./uploads/marketExecutive/${MEx.kyc?.[name]?.[i]}`)){
                    fs.unlinkSync(`./uploads/marketExecutive/${MEx.kyc?.[name]?.[i]}`)
                }
            }
        }
    }
    const updatedImages = await MarketExecutiveModel.updateOne({_id:req.params.id},{
        $set:{
            "insurance.policy_image":images?.policy_image,
            "kyc.pan.pan_image":images?.pan_image,
            "kyc.gst.gst_image":images?.gst_image,
            "kyc.aadhar.aadhar_image":images?.aadhar_image,
            "kyc.bank_details.passbook_image":images?.passbook_image,
        }
    })

    if(!updatedImages.acknowledged){
        return res.status(400).json({
            statusCode:400,
            status:"not updated",
            message:"files has not uploaded"
        })
    }

    return res.status(201).json({
        statusCode:201,
        status:"uploaded",
        data:{
            MarketExecutive:updatedImages
        },
        message:"files has been uploaded"
    })
})

export const addNominee = catchAsync(async (req,res,next)=>{
    const {nominee_name,nominee_dob,nominee_age,address,location,area,district,taluka,state,city,country,pincode,pan_no,aadhar_no,bank_name,account_no,confirm_account_no,ifsc_code} = req.body;
    console.log(req.body)
    const {pan_image,aadhar_image,passbook_image} = req.files;
    const addNominee = await MarketExecutiveModel.updateOne({_id:req.params.id},{
        $push:{
            nominee:{
                nominee_name,
                nominee_dob,
                nominee_age,
                "address.address":address,
                "address.location":location,
                "address.area":area,
                "address.district":district,
                "address.taluka":taluka,
                "address.state":state,
                "address.city":city,
                "address.country":country,
                "address.pincode":pincode,
                "kyc.pan.pan_no":pan_no,
                "kyc.pan.pan_image":pan_image[0]?.filename,
                "kyc.aadhar.aadhar_no":aadhar_no,
                "kyc.aadhar.pan_image":aadhar_image[0]?.filename,
                "bank_details.bank_name":bank_name,
                "bank_details.account_no":account_no,
                "bank_details.confirm_account_no":confirm_account_no,
                "bank_details.ifsc_code":ifsc_code,
                "bank_details.passbook_image":passbook_image[0]?.filename
              }
        }
    },{new:true})
    return res.status(201).json({
        statusCode:201,
        status:"added",
        data:{
            MarketExecutive:addNominee
        },
        message:"nominee hass been added"
    })
})