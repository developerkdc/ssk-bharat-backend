import bcrypt from "bcrypt";
import sendEmail from "../../../Utils/SendEmail.js";
import catchAsync from "../../../Utils/catchAsync.js";
import mongoose from "mongoose";

const model = mongoose.model("retailers");

export const LoginUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const secretKey = process.env.JWT_SECRET;
  const user = await model.findOne({
    "current_data.username": username,
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const passwordMatch = await bcrypt.compare(
    password,
    user.current_data.password
  );

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  const token = user.jwtToken(next);

  return res
    .status(200)
    .cookie("retailer_token", token)
    .cookie("retailer_userId", user.id)
    .json({
      statusCode: 200,
      token: token,
      user: user,
      message: "Login success",
    });
});

// export const SendOTP = catchAsync(async (req, res, next) => {
//   const { email } = req.body;
//   let otp = Math.floor(10000 + Math.random() * 90000);
//   let expiresIn = Date.now() + 5 * 60 * 1000;

//   const user = await userModel.findOneAndUpdate(
//     {
//       "current_data.primary_email_id": email,
//     },
//     {
//       $set: {
//         "current_data.otp": {
//           otp_digits: otp,
//           otp_expireIn: expiresIn,
//         },
//         "proposed_changes.otp": {
//           otp_digits: otp,
//           otp_expireIn: expiresIn,
//         },
//       },
//     }
//   );

//   if (!user) return next(new ApiError("user not found with this email", 400));

//   const message = `
//    <!DOCTYPE html>
// <html>
// <head>
//   <style>
//     /* General Styles */
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f4f4f4;
//       margin: 0;
//       padding: 0;
//       color:black
//     }
//     .container {
//       max-width: 600px;
//       margin: 0 auto;
//       padding: 20px;
//       background-color: #f9f9f9;
//     }

//     /* Header Styles */
//     .header {
//       background-color: #007bff;
//       color: #ffffff;
//       text-align: left;
//       padding: 0.1px 20px;
//     }
//     .content h1 {
//       font-size: 32px;
//       text-align: center;
//     }

//     /* Content Styles */
//     .content {
//       padding: 20px;
//       background-color: #ffffff;
//     }
//     .message {
//       font-size: 18px;
//       line-height: 1;
//     }
//     .reset-button {
//       display: inline-block;
//       background-color: #007bff;
//       color: #ffffff !important;
//       font-size: 16px;
//       padding: 10px 20px;
//       text-decoration: none;
//       border-radius: 5px;
//       margin-top: 15px;
//       margin-bottom: 15px;
//     }
//     .reset-button:hover {
//       background-color: #0056b3;
//       color: #ffffff;
//     }

//     /* Footer Styles */
//     .footer {
//       text-align: center;
//       padding: 20px 0;
//     }
//     .footer p {
//       font-size: 14px;
//       color: #666;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h1>SSK Bharat</h1>
//     </div>
//     <div class="content">
//       <h1>One Time Password </h1>
//       <p class="message">We received a request to reset your account password.</p>
//       <p class="message">Yout OTP is :${otp} </p>
     
//       <p><sup class="message" style="font-size: 14px;">If you didn't initiate this request, you can safely ignore this email.</sup></p>
//     </div>
//     <div class="footer">
//       <p>Best regards, Team SSK Bharat </p>
//     </div>
//   </div>
// </body>
// </html>
//   `;

//   await sendEmail({
//     email: email,
//     subject: "OTP",
//     message,
//   });

//   return res.status(200).json({
//     statusCode: 200,
//     success: "success",
//     message: `OTP sent successfully`,
//   });
// });

// export const VerifyOtp = catchAsync(async (req, res, next) => {
//   const { email, otp } = req.body;
//   if ((!email, !otp)) return next(new ApiError("Enter Email or OTP", 400));

//   const user = await userModel.findOne(
//     {
//       "current_data.primary_email_id": email,
//       "current_data.otp.otp_digits": otp.otp,
//     },
//     { "current_data.current_data": 1 }
//   );

//   if (!user) return next(new ApiError("Invalid User or Otp", 400));

//   if (user.current_data.otp.otp_expireIn <= Date.now()) {
//     await userModel.updateOne(
//       {
//         "current_data.primary_email_id": email,
//       },
//       {
//         $set: {
//           "current_data.otp": null,
//           "proposed_changes.otp": null,
//         },
//       }
//     );
//     return next(new ApiError("your otp has been expried", 400));
//   }

//   res.status(200).json({
//     statusCode: 200,
//     status: "verified",
//     // user:user,
//     message: "otp verified successfully",
//   });
// });

// export const UpdatePassword = catchAsync(async (req, res, next) => {
//   const { email, newPassword } = req.body;

//   if ((!email, !newPassword))
//     return next(new ApiError("Enter Email or Password", 400));

//   const existUser = await userModel.findOne({
//     "current_data.primary_email_id": email,
//   });

//   const hashedPassword = await bcrypt.hash(newPassword, 12);

//   const user = await userModel.updateOne(
//     {
//       "current_data.primary_email_id": email,
//     },
//     {
//       $set: {
//         "current_data.password": hashedPassword,
//         "current_data.otp": null,
//         "proposed_changes.password": hashedPassword,
//         "proposed_changes.otp": null,
//       },
//     }
//   );

//   return res.status(200).json({
//     statusCode: 200,
//     status: "Success",
//     data: {
//       user: user,
//     },
//     message: "Password updated successfully",
//   });
// });

// export const getUserById = catchAsync(async (req, res) => {
//   const id = req.offlineUser;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(200).json({
//       statusCode: 200,
//       status: "Failed",
//       message: "Invalid ID",
//     });
//   }
//   const user = await model.findOne({ _id:id });
//   return res.status(200).json({
//     statusCode: 200,
//     status: "Success",
//     data: {
//       user: user,
//     },
//     message: "User Details",
//   });
// });
export const getUserById = catchAsync(async (req, res) => {
    const id = req.retailerUser;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json({
        statusCode: 200,
        status: "Failed",
        message: "Invalid ID",
      });
    }
    const user = await model.findOne({ _id:id });
    return res.status(200).json({
      statusCode: 200,
      status: "Success",
      data: {
        user: user,
      },
      message: "User Details",
    });
  });