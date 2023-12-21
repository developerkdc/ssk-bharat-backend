import catchAsync from "../../Utils/catchAsync.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../../database/schema/user.schema";

export const LoginUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const secretKey = process.env.JWT_SECRET;
  const user = await userModel.findOne({primary_email_id:username});
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  const token = jwt.sign(
    { userId: user._id, username: user.first_name },
    secretKey,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  return res.status(200).cookie("token", token).json({
    statusCode: 200,
    token: token,
    message: "Login success",
  });
});


