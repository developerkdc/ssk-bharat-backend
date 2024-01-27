import catchAsync from "../../../Utils/catchAsync.js";
import mongoose from "mongoose";
import userModel from "../../../database/schema/Users/user.schema.js";
import bcrypt from "bcrypt";
import ExcelJS from "exceljs";
import { dynamicSearch } from "../../../Utils/dynamicSearch.js";
import { approvalData } from "../../HelperFunction/approvalFunction.js";
import { createdByFunction } from "../../HelperFunction/createdByfunction.js";
import ApiError from "../../../Utils/ApiError.js";

export const AddUser = catchAsync(async (req, res) => {
  const user = req.user;
  const userData = req.body;
  const address = JSON.parse(req.body.address);
  const kyc = JSON.parse(req.body.kyc);
  const approver_one = JSON.parse(req.body.approver_one);
  const approver_two = JSON.parse(req.body.approver_two);
  userData.approver_one = approver_one;
  userData.approver_two = approver_two;
  userData.address = address;
  userData.kyc = kyc;
  userData.profile_pic=req.files.profile_pic[0].path ;
  userData.kyc.pan_card_detail.pan_image=req.files.pan_image[0].path;
  userData.kyc.aadhar_card_detail.aadhar_image=req.files.aadhar_image[0].path;
  userData.kyc.bank_details.passbook_image=req.files.passbook_image[0].path;
  const saltRounds = 10;
  userData.password = await bcrypt.hash(userData.password, saltRounds);
  console.log(userData)
  const newUser = new userModel({
    current_data: {
      ...userData,
      created_by: createdByFunction(user),
    },
    approver: approvalData(user, user?.current_data.role_id.role_name),
  });
  const savedUser = await newUser.save();

  // Send a success response
  return res.status(201).json({
    statusCode: 201,
    status: "Success",
    data: {
      user: savedUser,
    },
    message: "User created successfully",
  });
});

export const EditUser = catchAsync(async (req, res) => {
  console.log(req.params.userId)
  const userId = req.params.userId;
  const loginUser = req.user;
  const updateData = req.body;
  console.log(updateData);
  updateData.updated_at = new Date().toLocaleString();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await userModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        "proposed_changes.employee_id": updateData?.employee_id,
        "proposed_changes.first_name": updateData?.first_name,
        "proposed_changes.last_name": updateData?.last_name,
        "proposed_changes.primary_email_id": updateData?.primary_email_id,
        "proposed_changes.secondary_email_id": updateData?.secondary_email_id,
        "proposed_changes.password": updateData?.password,
        "proposed_changes.primary_mobile_no": updateData?.primary_mobile_no,
        "proposed_changes.secondary_mobile_no": updateData?.secondary_mobile_no,
        "proposed_changes.address": updateData?.address,
        "proposed_changes.role_id": updateData?.role_id,
        "proposed_changes.kyc": updateData?.kyc,
        "proposed_changes.status": false,
        "proposed_changes.isActive": updateData?.isActive,
        approver: approvalData(loginUser),
        updated_at: Date.now(),
      },
    },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      status: "Error",
      message: "User not found",
    });
  }

  return res.json({
    statusCode: 200,
    status: "Success",
    data: user,
    message: "Updated successfully",
  });
});

export const ChangePassword = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { currentPassword, newPassword } = req.body;
  const saltRounds = 10;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await userModel.findById({ _id: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Check if the current password matches
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.current_data.password
  );

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  user.current_data.password = hashedPassword;
  user.proposed_changes.password = hashedPassword;
  const updatedUser = await user.save();
  res.json({
    statusCode: 200,
    status: "Success",
    data: {
      user: updatedUser,
    },
    message: "Password updated successfully",
  });
});

export const FetchUsers = catchAsync(async (req, res) => {
  const { string, boolean, numbers } = req?.body?.searchFields || {};
  console.log(req.query);
  const search = req.query.search || "";

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const sortField = req.query.sortField || "created_at";
  const sortOrder = req.query.sortOrder || "asc";
  const sort = {};
  sort[sortField] = sortOrder === "asc" ? 1 : -1;

  const filter = {};
  if (req.query.district)
    filter["current_data.address.district"] = req.query.district;
  if (req.query.location)
    filter["current_data.address.location"] = req.query.location;
  if (req.query.taluka)
    filter["current_data.address.taluka"] = req.query.taluka;
  if (req.query.state) filter["current_data.address.state"] = req.query.state;
  if (req.query.city) filter["current_data.address.city"] = req.query.city;
  if (req.query.area) filter["current_data.address.area"] = req.query.area;

  //search  functionality
  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        data: [],
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  // Fetching users
  const users = await userModel
    .find({ ...filter, ...searchQuery, "current_data.status": true })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("current_data.role_id");
    if(!users){
      throw new Error(new ApiError("Error during fetching", 400));
    }

  //total pages
  const totalDocuments = await userModel.countDocuments({
    ...filter,
    ...searchQuery,
    "current_data.status": true,
  });
  const totalPages = Math.ceil(totalDocuments / limit);
  let usersdata = users;
  usersdata["imagePath"] = `${process.env.IMAGE_PATH}/admin/users/`;

  return res.json({
    statusCode: 200,
    status: "Success",
    data: usersdata,
    message: "Fetched successfully",
    totalPages: totalPages,
  });
});

export const getUserList = catchAsync(async (req, res, next) => {
  const users = await userModel.aggregate([
    {
      $match: { "current_data.status": true, "current_data.isActive": true },
    },
    {
      $project: {
        user_id: "$_id",
        name: {
          $concat: ["$current_data.first_name", " ", "$current_data.last_name"],
        },
        employee_id: "$current_data.employee_id",
        email_id: "$current_data.primary_email_id",
      },
    },
  ]);

  if (users) {
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: users,
      message: "All Users List",
    });
  }
});

export const UserLogsFile = catchAsync(async (req, res) => {
  const userLogs = await mongoose
    .model("userslogs")
    .find()
    .populate("employee_id");

  let workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("userLogs");
  worksheet.columns = [
    { header: "employee_id", key: "employee_id" },
    { header: "action", key: "action" },
    { header: "userUpdatedEmp_id", key: "userUpdatedEmp_id" },
    { header: "timestamp", key: "timestamp" },
    { header: "updatedFields", key: "updatedFields" },
  ];

  await userLogs.forEach((data) => {
    worksheet.addRow({
      employee_id: data.employee_id,
      action: data.action,
      userUpdatedEmp_id: data.userUpdatedEmp_id,
      timestamp: data.timestamp,
      updatedFields: data.updatedFields,
    });
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment;filename=" + "usersLog.csv");
  workbook.xlsx.write(res); // fix: use workbook.xlsx.write instead of workbook.xsls.write
  return res.status(200);
});

export const UserLogs = catchAsync(async (req, res) => {
  const log = await mongoose
    .model("userslogs")
    .find({})
    .populate("employee_id");
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: log,
    message: "Logs fetched successfully",
  });
});

export const generatePassword = catchAsync(async(req,res)=>{
  const symbols = "!@#$%^&*()_-+=<>?/{}";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  const getRandomChar = (chars) => {
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars.charAt(randomIndex);
  };

  const password = [
    getRandomChar(symbols),
    getRandomChar(uppercase),
    getRandomChar(lowercase),
    getRandomChar(numbers),
  ];
  while (password.length < 8) {
    const charSet = symbols + uppercase + lowercase + numbers;
    password.push(getRandomChar(charSet));
  }
  password.sort(() => Math.random() - 0.5);
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    data: password.join(""),
    message: "Password Generated Successfully",
  });
})
