import ApiError from "../../Utils/ApiError.js";
import catchAsync from "../../Utils/catchAsync.js";
import connect from "../../database/mongo.service.js";
import mongoose from "mongoose";
import userModel from "../../database/schema/user.schema.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const LoginUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const secretKey = "yourSecretKey";
  const saltRounds = 10;
  // Check if the user exists
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Use bcrypt to compare the entered password with the hashed password
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create a JWT token
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    secretKey,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: abc,
  });
});

export const AddUser = catchAsync(async (req, res) => {
  const userData = req.body;
  console.log(userData);
  const saltRounds = 10;
  userData.password = await bcrypt.hash(userData.password, saltRounds);
  // Create a new user using the User model
  const newUser = new userModel(userData);

  // Save the new user to the database
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

  console.log(updateData);
  // Validate if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // Find the user by ID and update the data
  const user = await userModel.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  );

  // Check if the user exists
  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      status: "Error",
      message: "User not found",
    });
  }

  res.json({
    statusCode:200,
    status:"Success",
    data:user,
    message:"Updated successfully"
  });
});

export const ChangePassword = catchAsync(async(req,res)=>{
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
})

export const FetchUsers = catchAsync(async(req,res)=>{
  let users = await userModel.find();
  return res.json({
    statusCode: 200,
    status: "Success",
    data: users,
    message: "Fetched successfully",
  });
})