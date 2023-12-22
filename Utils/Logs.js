import mongoose from "mongoose";

export const handleUserChange = async (req, change, logCollection) => {
  const userId = change.documentKey._id;
  const timestamp = new Date().toLocaleString();

  let userLog;

  if (change.operationType === "update") {
    const updatedFields = change.updateDescription.updatedFields;
    // Create a user log entry for update
    userLog = new mongoose.model(logCollection)({
      employee_id: req.userId,
      action: "update",
      userUpdatedEmp_id: userId,
      timestamp: timestamp,
      updatedFields: updatedFields,
    });
  }

  if (change.operationType === "insert") {
    const updatedFields = change.fullDocument;
    // Create a user log entry for insert
    userLog = new mongoose.model(logCollection)({
      employee_id: req.userId,
      action: "insert",
      userCreatedEmp_id: userId,
      timestamp: timestamp,
      updatedFields: updatedFields,
    });
  }

  // Save the user log only if it's not null (meaning it's either an insert or an update)
  if (userLog) {
    await userLog.save();
    console.log("User logs:", userLog);
  }
};
