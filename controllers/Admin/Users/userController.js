import catchAsync from "../../../Utils/catchAsync.js";
import mongoose from "mongoose";
import userModel from "../../../database/schema/Users/user.schema.js";
import bcrypt from "bcrypt";
import ExcelJS from "exceljs";
import { dynamicSearch } from "../../../Utils/dynamicSearch.js";
import { approvalData } from "../../HelperFunction/approvalFunction.js";
import { createdByFunction } from "../../HelperFunction/createdByfunction.js";

export const AddUser = catchAsync(async (req, res) => {
  const user = req.user;
  const userData = req.body;
  const saltRounds = 10;
  userData.password = await bcrypt.hash(userData.password, saltRounds);
  const newUser = new userModel({
    current_data: { ...req.body, created_by: createdByFunction(user) },
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
  const userId = req.params.userId;
  const loginUser = req.user;
  const updateData = req.body;
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

  res.json({
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
  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Check if the current password matches
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = hashedPassword;
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
  const search = req.query.search || "";

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const sortField = req.query.sortField || "current_data.employee_id";
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

  //total pages
  const totalDocuments = await userModel.countDocuments({
    ...filter,
    ...searchQuery,
    "current_data.status": true,
  });
  const totalPages = Math.ceil(totalDocuments / limit);

  return res.json({
    statusCode: 200,
    status: "Success",
    data: users,
    message: "Fetched successfully",
    totalPages: totalPages,
  });
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
