import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import MarketExecutiveModel from "../../../database/schema/MET/MarketExecutive.schema.js";
import sendEmail from "../../../Utils/SendEmail.js";
import catchAsync from "../../../Utils/catchAsync.js";
import ApiError from "../../../Utils/ApiError.js";

export const METLoginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new ApiError("Enter Email or Password", 400))

  const met = await MarketExecutiveModel.findOne({
    "current_data.contact_person_details.primary_email_id": email,
    "current_data.status":true
  });
  if (!met) return next(new ApiError("Invalid Email or Password", 400))

  const passwordMatch = await bcrypt.compare(
    password,
    met.current_data.contact_person_details.password
  );

  if (!passwordMatch) return next(new ApiError("Invalid Email or Password", 400))

  met.current_data.contact_person_details.password = undefined;
  met.current_data.contact_person_details.otp = undefined;
  met.approver = undefined;
  met.proposed_changes.contact_person_details.password = undefined;
  met.proposed_changes.contact_person_details.otp = undefined;

  const token = met.jwtToken(next);

  res.cookie("ssk_met_token", token);
  res.cookie("ssk_met_user_id", met.id);

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    token: token,
    data: {
      metUser: met
    },
    message: "Login success",
  });

});

export const METSendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  let otp = Math.floor(10000 + Math.random() * 90000);
  let expiresIn = Date.now() + (5 * 60 * 1000);

  const metUser = await MarketExecutiveModel.findOneAndUpdate({
    "current_data.contact_person_details.primary_email_id": email,
  }, {
    $set: {
      "current_data.contact_person_details.otp": {
        otp_digits: otp,
        otp_expireIn: expiresIn,
      },
      "proposed_changes.contact_person_details.otp": {
        otp_digits: otp,
        otp_expireIn: expiresIn,
      }
    }
  });

  if (!metUser) return next(new ApiError("user not found with this email", 400));

  const message = `
   <!DOCTYPE html>
<html>
<head>
  <style>
    /* General Styles */
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color:black
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }

    /* Header Styles */
    .header {
      background-color: #007bff;
      color: #ffffff;
      text-align: left;
      padding: 0.1px 20px;
    }
    .content h1 {
      font-size: 32px;
      text-align: center;
    }

    /* Content Styles */
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .message {
      font-size: 18px;
      line-height: 1;
    }
    .reset-button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff !important;
      font-size: 16px;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .reset-button:hover {
      background-color: #0056b3;
      color: #ffffff;
    }

    /* Footer Styles */
    .footer {
      text-align: center;
      padding: 20px 0;
    }
    .footer p {
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SSK Bharat</h1>
    </div>
    <div class="content">
      <h1>One Time Password </h1>
      <p class="message">We received a request to reset your account password.</p>
      <p class="message">Yout OTP is :${otp} </p>
     
      <p><sup class="message" style="font-size: 14px;">If you didn't initiate this request, you can safely ignore this email.</sup></p>
    </div>
    <div class="footer">
      <p>Best regards, Team SSK Bharat </p>
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    email: email,
    subject: "OTP",
    message,
  });

  return res.status(200).json({
    statusCode:200,
    success: "success",
    message: `OTP sent successfully`,
  });
});

export const METVerifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email, !otp) return next(new ApiError("Enter Email or OTP", 400));

  const met = await MarketExecutiveModel.findOne({
    "current_data.contact_person_details.primary_email_id": email,
    "current_data.contact_person_details.otp.otp_digits": otp,
  }, { "current_data.contact_person_details": 1 })

  if (!met) return next(new ApiError("Invalid User or Otp", 400));

  if (met.current_data.contact_person_details.otp.otp_expireIn <= Date.now()) {
    await MarketExecutiveModel.updateOne({
      "current_data.contact_person_details.primary_email_id": email,
    }, {
      $set: {
        "current_data.contact_person_details.otp": null,
        "proposed_changes.contact_person_details.otp": null
      }
    })
    return next(new ApiError("your otp has been expried", 400));
  }

  res.status(200).json({
    statusCode: 200,
    status: "verified",
    // met:met,
    message: "otp verified successfully"
  })


})

export const METUpdatePassword = catchAsync(async (req, res, next) => {
  const { email, newPassword } = req.body;

  if (!email, !newPassword) return next(new ApiError("Enter Email or Password", 400));

  const metUser = await MarketExecutiveModel.findOne({
    "current_data.contact_person_details.primary_email_id": email,
  });

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const met = await MarketExecutiveModel.updateOne({
    "current_data.contact_person_details.primary_email_id": email,
  }, {
    $set: {
      "current_data.contact_person_details.password":hashedPassword,
      "current_data.contact_person_details.otp":null,
      "proposed_changes.contact_person_details.password":hashedPassword,
      "proposed_changes.contact_person_details.otp":null
    }
  });

  return res.status(200).json({
    statusCode: 200,
    status: "Success",
    data: {
      metUser: met,
    },
    message: "Password updated successfully",
  });
});

