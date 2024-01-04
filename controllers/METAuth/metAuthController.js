
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import METModel from "../../database/schema/MET/MarketExecutive.schema.js";
import sendEmail from "../../Utils/SendEmail.js";
import catchAsync from "../../Utils/catchAsync.js";

const saltRounds = 10;

export const METLoginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const secretKey = process.env.JWT_SECRET;
  const met = await METModel.findOne({ "current_data.contact_person_details.primary_email_id": email });
  if (!met) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const passwordMatch = await bcrypt.compare(password, met.current_data.contact_person_details.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  const token = met.jwtToken(next);

  return res.status(200).cookie("token", token).cookie("metUserId", met.id).json({
    statusCode: 200,
    token: token,
    message: "Login success",
  });
});

export const METSendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  let otp = Math.floor(Math.random() * 100000);
  const metUser = await METModel.findOne({ "current_data.contact_person_details.primary_email_id": email });

  if(!metUser){
    return res.status(400).json({
      success: "failed",
      message: `User Does not Exist`,
    });
  }
  metUser.otp = otp;
  const updatedUser = await metUser.save();
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
console.log(updatedUser)
  await sendEmail({
    email: email,
    subject: "OTP",
    message,
  });

  return res.status(200).json({
    success: true,
    message: `OTP sent successfully`,
  });
});

export const METVerifyOTPAndUpdatePassword = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const metUser = await METModel.findOne({ "current_data.contact_person_details.primary_email_id": email });
  console.log(metUser);
  if (!otp || otp !== metUser.otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  metUser.password = hashedPassword;
  metUser.otp = null;
  const updatedUser = await metUser.save();
  return res.status(200).json({
    statusCode: 200,
    status: "Success",
    data: {
      metUser: updatedUser,
    },
    message: "Password updated successfully",
  });
});
