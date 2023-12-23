import ApiError from "../../Utils/ApiError.js";
import catchAsync from "../../Utils/catchAsync.js";
import connect from "../../database/mongo.service.js";
import mongoose from "mongoose";
import userModel from "../../database/schema/user.schema.js";
import bcrypt from "bcrypt";
import userlogModel from "../../database/schema/userlog.schema.js";
import ExcelJS from "exceljs";

const userChangeStream = userModel.watch();
userChangeStream.on("change", async (change) => {
  if (change.operationType === "update") {
    const userId = change.documentKey._id;
    const updatedFields = change.updateDescription.updatedFields;

    // Create a user log entry
    const userLog = new userlogModel({
      employee_id: userId,
      action: "update",
      userUpdatedEmp_id: userId,
      timestamp: new Date().toLocaleString(),
      updatedFields: updatedFields,
    });

    await userLog.save();
    console.log("Updated user logs:", userLog);
  }
  if (change.operationType === "insert") {
    console.log(change.fullDocument);
    const userId = change.documentKey._id;
    const updatedFields = change.fullDocument;

    // Create a user log entry
    const userLog = new userlogModel({
      employee_id: userId,
      action: "insert",
      userCreatedEmp_id: userId,
      timestamp: new Date().toLocaleString(),
      updatedFields: updatedFields,
    });

    await userLog.save();
    console.log("Updated user logs:", userLog);
  }
});
export const AddUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const saltRounds = 10;
  userData.password = await bcrypt.hash(userData.password, saltRounds);
  const newUser = new userModel(userData);
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
  const updateData = req.body;
  updateData.updated_at = new Date().toLocaleString();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await userModel.findByIdAndUpdate(
    userId,
    { $set: updateData },
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
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const sortField = req.query.sortField || "employee_id";
  const sortOrder = req.query.sortOrder || "asc";
  const sort = {};
  sort[sortField] = sortOrder === "asc" ? 1 : -1;

  const filter = {};
  if (req.query.district) filter["address.district"] = req.query.district;
  if (req.query.location) filter["address.location"] = req.query.location;
  if (req.query.taluka) filter["address.taluka"] = req.query.taluka;
  if (req.query.state) filter["address.state"] = req.query.state;
  if (req.query.city) filter["address.city"] = req.query.city;
  if (req.query.area) filter["address.area"] = req.query.area;

  // Fetching users
  const users = await userModel.find(filter).sort(sort).skip(skip).limit(limit);

  return res.json({
    statusCode: 200,
    status: "Success",
    data: users,
    message: "Fetched successfully",
  });
});

export const UserLogsFile = catchAsync(async (req, res) => {
  const userLogs = await userlogModel.find().populate("employee_id");

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

export const UserLogs = catchAsync(async(req,res)=>{
  const log = await userlogModel.find({}).populate("employee_id");
  return res.status(200).json({
    statusCode:200,
    status:"success",
    data:log,
    message:"Logs fetched successfully"
  })
})