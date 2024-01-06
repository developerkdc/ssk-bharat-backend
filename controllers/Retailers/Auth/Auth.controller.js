import mongoose from "mongoose";
import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../Firebase/FirebaseConfig";

export const RetailerLogin = catchAsync(async (req,res,next)=>{
    const {mobileNo} = req.body;
    if(!mobileNo) return next(ApiError("Mobile number is required",400))
    const retailer = await mongoose.model("retailers").findOne({"current_data.register_mobile_no":mobileNo},{"current_data.register_mobile_no":1});
    if(!retailer) return next(ApiError("This mobile number is not exists",400));

    const appVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log(response)
        },
        'expired-callback': () => {
          // reCAPTCHA verification expired, handle it if needed
        }
      });

    signInWithPhoneNumber(auth,mobileNo,appVerifier).then((confirmationResult) => {
        return res.status(200).json({
            message:"OTP send successfully",
            confirmationResult
        })
      }).catch((error) => {
        return next(error)
      });

    
})