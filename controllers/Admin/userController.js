import ApiError from "../../Utils/ApiError.js";
import catchAsync from "../../Utils/catchAsync.js";
import connect from "../../database/mongo.service.js";
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
    message: abc
  })
})

export const AddUser = catchAsync(async(req,res)=>{
   const userData = req.body;

   // Create a new user using the User model
   const newUser = new Users(userData);

   // Save the new user to the database
   const savedUser = await newUser.save();

   // Send a success response
   res.status(201).json(savedUser);
})